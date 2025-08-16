export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'COMPANY_ADMIN';
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const API_BASE_URL = 'http://localhost:3000';