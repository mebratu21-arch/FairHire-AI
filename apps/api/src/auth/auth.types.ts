export interface UserSession {
  userId: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  tenantName: string;
  role?: 'admin' | 'recruiter' | 'hiring_manager';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserSession;
  message: string;
}
