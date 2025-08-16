export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'COMPANY_ADMIN';
  companyId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  name: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyId: number;
  company?: Company;
  createdAt: string;
  updatedAt: string;
  location?: string;
  salary?: string;
  type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  requirements?: string[];
  benefits?: string[];
}

export interface Application {
  id: number;
  userId: number;
  jobId: number;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  resume?: string;
  appliedAt: string;
  updatedAt: string;
  user?: User;
  job?: Job;
}