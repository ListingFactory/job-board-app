import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Auth middleware
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'JobBoard API is running!' });
});

// Auth routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'USER' } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Jobs routes
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const { search, company, limit = 20, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (company) {
      where.company = {
        name: { contains: company, mode: 'insensitive' }
      };
    }
    
    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: true
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.job.count({ where });
    
    res.json({ jobs, total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        company: true
      }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/jobs', authenticateToken, async (req: any, res: Response) => {
  try {
    const { title, description, companyId } = req.body;
    
    if (req.user.role !== 'COMPANY_ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const job = await prisma.job.create({
      data: {
        title,
        description,
        companyId: parseInt(companyId)
      },
      include: {
        company: true
      }
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Companies routes
app.get('/api/companies', async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        jobs: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { jobs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/companies', authenticateToken, async (req: any, res: Response) => {
  try {
    const { name, website } = req.body;
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const company = await prisma.company.create({
      data: {
        name,
        website
      }
    });
    
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Applications routes
app.get('/api/applications', authenticateToken, async (req: any, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.userId },
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/applications', authenticateToken, async (req: any, res: Response) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: req.user.userId,
          jobId: parseInt(jobId)
        }
      }
    });
    
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const application = await prisma.application.create({
      data: {
        userId: req.user.userId,
        jobId: parseInt(jobId),
        coverLetter,
        resume
      },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/applications/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const applicationId = parseInt(req.params.id);
    
    if (req.user.role !== 'COMPANY_ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: true,
        job: {
          include: {
            company: true
          }
        }
      }
    });
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jobs/:id/applications', authenticateToken, async (req: any, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (req.user.role !== 'COMPANY_ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const [jobCount, companyCount, userCount, applicationCount] = await Promise.all([
      prisma.job.count(),
      prisma.company.count(),
      prisma.user.count(),
      prisma.application.count()
    ]);
    
    res.json({
      jobs: jobCount,
      companies: companyCount,
      users: userCount,
      applications: applicationCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
