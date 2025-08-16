import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Type definitions
export interface Company {
  id: string;
  name: string;
  website?: string;
  description?: string;
  location?: string;
  industry?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  company?: Company;
  location?: string;
  salary?: string;
  type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  requirements?: string[];
  benefits?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  resume?: string;
  appliedAt: string;
  updatedAt: string;
  user?: any;
  job?: Job;
}

// Utility functions
const timestampToString = (timestamp: any): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp || new Date().toISOString();
};

// Company services
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const companiesRef = collection(db, 'companies');
    const q = query(companiesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToString(doc.data().createdAt),
      updatedAt: timestampToString(doc.data().updatedAt),
    })) as Company[];
  } catch (error) {
    console.error('Error getting companies:', error);
    return [];
  }
};

export const getCompany = async (id: string): Promise<Company | null> => {
  try {
    const companyRef = doc(db, 'companies', id);
    const companySnap = await getDoc(companyRef);
    
    if (companySnap.exists()) {
      const data = companySnap.data();
      return {
        id: companySnap.id,
        ...data,
        createdAt: timestampToString(data.createdAt),
        updatedAt: timestampToString(data.updatedAt),
      } as Company;
    }
    return null;
  } catch (error) {
    console.error('Error getting company:', error);
    return null;
  }
};

export const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const companiesRef = collection(db, 'companies');
    const now = Timestamp.now();
    const docRef = await addDoc(companiesRef, {
      ...companyData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Job services
export const getJobs = async (options: {
  limitCount?: number;
  searchTerm?: string;
  companyId?: string;
  lastDoc?: DocumentSnapshot;
} = {}): Promise<{ jobs: Job[]; lastDoc?: DocumentSnapshot }> => {
  try {
    const jobsRef = collection(db, 'jobs');
    let q = query(
      jobsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    if (options.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    if (options.lastDoc) {
      q = query(q, startAfter(options.lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const jobs = await Promise.all(
      querySnapshot.docs.map(async (jobDoc) => {
        const jobData = jobDoc.data();
        let company = null;
        
        if (jobData.companyId) {
          company = await getCompany(jobData.companyId);
        }

        return {
          id: jobDoc.id,
          ...jobData,
          company,
          createdAt: timestampToString(jobData.createdAt),
          updatedAt: timestampToString(jobData.updatedAt),
        };
      })
    );

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { jobs: jobs as Job[], lastDoc };
  } catch (error) {
    console.error('Error getting jobs:', error);
    return { jobs: [] };
  }
};

export const getJob = async (id: string): Promise<Job | null> => {
  try {
    const jobRef = doc(db, 'jobs', id);
    const jobSnap = await getDoc(jobRef);
    
    if (jobSnap.exists()) {
      const jobData = jobSnap.data();
      const company = await getCompany(jobData.companyId);
      
      return {
        id: jobSnap.id,
        ...jobData,
        company,
        createdAt: timestampToString(jobData.createdAt),
        updatedAt: timestampToString(jobData.updatedAt),
      } as Job;
    }
    return null;
  } catch (error) {
    console.error('Error getting job:', error);
    return null;
  }
};

export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const jobsRef = collection(db, 'jobs');
    const now = Timestamp.now();
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', id);
    await updateDoc(jobRef, {
      ...jobData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', id);
    await updateDoc(jobRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Application services
export const createApplication = async (
  applicationData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  try {
    const applicationsRef = collection(db, 'applications');
    const now = Timestamp.now();
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      status: 'PENDING',
      appliedAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const getUserApplications = async (userId: string): Promise<Application[]> => {
  try {
    const applicationsRef = collection(db, 'applications');
    const q = query(
      applicationsRef,
      where('userId', '==', userId),
      orderBy('appliedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const applications = await Promise.all(
      querySnapshot.docs.map(async (appDoc) => {
        const appData = appDoc.data();
        const job = await getJob(appData.jobId);
        
        return {
          id: appDoc.id,
          ...appData,
          job,
          appliedAt: timestampToString(appData.appliedAt),
          updatedAt: timestampToString(appData.updatedAt),
        };
      })
    );

    return applications as Application[];
  } catch (error) {
    console.error('Error getting user applications:', error);
    return [];
  }
};

// Statistics
export const getStats = async () => {
  try {
    const [companiesSnap, jobsSnap, applicationsSnap] = await Promise.all([
      getDocs(collection(db, 'companies')),
      getDocs(query(collection(db, 'jobs'), where('isActive', '==', true))),
      getDocs(collection(db, 'applications')),
    ]);

    return {
      companies: companiesSnap.size,
      jobs: jobsSnap.size,
      applications: applicationsSnap.size,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { companies: 0, jobs: 0, applications: 0 };
  }
};