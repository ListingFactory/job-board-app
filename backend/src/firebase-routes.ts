import express, { type Request, type Response } from 'express';
import { firestore, auth } from './firebase-admin';

const router = express.Router();

// Firebase Auth 미들웨어
const authenticateFirebaseToken = async (req: any, res: Response, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const idToken = authHeader && authHeader.split(' ')[1];

    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// 사용자 권한 확인 미들웨어
const checkUserRole = (allowedRoles: string[]) => {
  return async (req: any, res: Response, next: any) => {
    try {
      const userDoc = await firestore.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();
      if (!allowedRoles.includes(userData?.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.userRole = userData?.role;
      next();
    } catch (error) {
      console.error('Role check failed:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// 채용공고 관련 라우트
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const { limit = 20, search, companyId } = req.query;
    let query = firestore.collection('jobs').where('isActive', '==', true);

    if (companyId) {
      query = query.where('companyId', '==', companyId);
    }

    query = query.orderBy('createdAt', 'desc').limit(parseInt(limit as string));

    const snapshot = await query.get();
    const jobs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const jobData = doc.data();
        
        // 회사 정보 가져오기
        let company = null;
        if (jobData.companyId) {
          const companyDoc = await firestore.collection('companies').doc(jobData.companyId).get();
          if (companyDoc.exists) {
            company = { id: companyDoc.id, ...companyDoc.data() };
          }
        }

        return {
          id: doc.id,
          ...jobData,
          company,
          createdAt: jobData.createdAt?.toDate?.()?.toISOString() || jobData.createdAt,
          updatedAt: jobData.updatedAt?.toDate?.()?.toISOString() || jobData.updatedAt,
        };
      })
    );

    // 검색 필터링 (Firestore의 제한으로 인해 클라이언트 사이드에서 처리)
    let filteredJobs = jobs;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.company?.name.toLowerCase().includes(searchTerm)
      );
    }

    res.json({ jobs: filteredJobs, total: filteredJobs.length });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const jobDoc = await firestore.collection('jobs').doc(req.params.id).get();
    
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();
    
    // 회사 정보 가져오기
    let company = null;
    if (jobData?.companyId) {
      const companyDoc = await firestore.collection('companies').doc(jobData.companyId).get();
      if (companyDoc.exists) {
        company = { id: companyDoc.id, ...companyDoc.data() };
      }
    }

    const job = {
      id: jobDoc.id,
      ...jobData,
      company,
      createdAt: jobData?.createdAt?.toDate?.()?.toISOString() || jobData?.createdAt,
      updatedAt: jobData?.updatedAt?.toDate?.()?.toISOString() || jobData?.updatedAt,
    };

    res.json(job);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/jobs', authenticateFirebaseToken, checkUserRole(['ADMIN', 'COMPANY_ADMIN']), async (req: any, res: Response) => {
  try {
    const { title, description, companyId, location, salary, type, requirements, benefits } = req.body;
    
    const jobData = {
      title,
      description,
      companyId,
      location,
      salary,
      type: type || 'FULL_TIME',
      requirements: requirements || [],
      benefits: benefits || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection('jobs').add(jobData);
    
    res.status(201).json({ id: docRef.id, ...jobData });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 회사 관련 라우트
router.get('/companies', async (req: Request, res: Response) => {
  try {
    const snapshot = await firestore.collection('companies').orderBy('createdAt', 'desc').get();
    
    const companies = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const companyData = doc.data();
        
        // 회사별 채용공고 수 계산
        const jobsSnapshot = await firestore
          .collection('jobs')
          .where('companyId', '==', doc.id)
          .where('isActive', '==', true)
          .get();

        return {
          id: doc.id,
          ...companyData,
          jobCount: jobsSnapshot.size,
          createdAt: companyData.createdAt?.toDate?.()?.toISOString() || companyData.createdAt,
          updatedAt: companyData.updatedAt?.toDate?.()?.toISOString() || companyData.updatedAt,
        };
      })
    );

    res.json(companies);
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/companies', authenticateFirebaseToken, checkUserRole(['ADMIN']), async (req: any, res: Response) => {
  try {
    const { name, website, description, location, industry, size } = req.body;
    
    const companyData = {
      name,
      website,
      description,
      location,
      industry,
      size,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection('companies').add(companyData);
    
    res.status(201).json({ id: docRef.id, ...companyData });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 지원서 관련 라우트
router.get('/applications', authenticateFirebaseToken, async (req: any, res: Response) => {
  try {
    const snapshot = await firestore
      .collection('applications')
      .where('userId', '==', req.user.uid)
      .orderBy('appliedAt', 'desc')
      .get();

    const applications = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const appData = doc.data();
        
        // 채용공고 정보 가져오기
        const jobDoc = await firestore.collection('jobs').doc(appData.jobId).get();
        let job = null;
        if (jobDoc.exists) {
          const jobData = jobDoc.data();
          
          // 회사 정보도 가져오기
          let company = null;
          if (jobData?.companyId) {
            const companyDoc = await firestore.collection('companies').doc(jobData.companyId).get();
            if (companyDoc.exists) {
              company = { id: companyDoc.id, ...companyDoc.data() };
            }
          }
          
          job = {
            id: jobDoc.id,
            ...jobData,
            company,
          };
        }

        return {
          id: doc.id,
          ...appData,
          job,
          appliedAt: appData.appliedAt?.toDate?.()?.toISOString() || appData.appliedAt,
          updatedAt: appData.updatedAt?.toDate?.()?.toISOString() || appData.updatedAt,
        };
      })
    );

    res.json(applications);
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/applications', authenticateFirebaseToken, async (req: any, res: Response) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    
    // 중복 지원 확인
    const existingApplication = await firestore
      .collection('applications')
      .where('userId', '==', req.user.uid)
      .where('jobId', '==', jobId)
      .get();

    if (!existingApplication.empty) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const applicationData = {
      userId: req.user.uid,
      jobId,
      coverLetter,
      resume,
      status: 'PENDING',
      appliedAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection('applications').add(applicationData);
    
    res.status(201).json({ id: docRef.id, ...applicationData });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 통계 라우트
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [companiesSnapshot, jobsSnapshot, applicationsSnapshot] = await Promise.all([
      firestore.collection('companies').get(),
      firestore.collection('jobs').where('isActive', '==', true).get(),
      firestore.collection('applications').get(),
    ]);

    res.json({
      companies: companiesSnapshot.size,
      jobs: jobsSnapshot.size,
      applications: applicationsSnapshot.size,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;