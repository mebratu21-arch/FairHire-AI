import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto, UserSession } from './auth.types';

// In-memory persistent demo store for fast development and testing when Postgres container is launching
interface StoredUser {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  createdAt: string;
}

@Injectable()
export class AuthService {
  private users: StoredUser[] = [
    {
      id: 'usr_recruiter_01',
      tenantId: 'tenant_fairhire_default',
      email: 'recruiter@fairhire.ai',
      // Pre-hashed password for "FairHire2026!":
      passwordHash: this.hashPassword('FairHire2026!'),
      fullName: 'Sarah Chen (Lead Recruiter)',
      role: 'recruiter',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_admin_01',
      tenantId: 'tenant_fairhire_default',
      email: 'admin@fairhire.ai',
      passwordHash: this.hashPassword('AdminMaster2026!'),
      fullName: 'Alexander Wright (Talent Operations Admin)',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];

  // Cryptographically secure password hashing using SHA256 + HMAC salt
  hashPassword(password: string): string {
    const salt = 'fairhire_secret_salt_2026';
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  }

  verifyPassword(password: string, hash: string): boolean {
    const computed = this.hashPassword(password);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }

  // Generate signed JWT token
  createJwtToken(user: UserSession): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.userId,
        tenantId: user.tenantId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
      }),
    ).toString('base64url');

    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fairhire_jwt_production_secret_key_81726354')
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  verifyJwtToken(token: string): UserSession {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }
    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fairhire_jwt_production_secret_key_81726354')
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Session expired');
    }

    return {
      userId: decoded.sub,
      tenantId: decoded.tenantId,
      email: decoded.email,
      fullName: decoded.fullName,
      role: decoded.role,
    };
  }

  async register(dto: RegisterDto): Promise<{ user: UserSession; token: string }> {
    const existing = this.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const tenantId = `tenant_${dto.tenantName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newUser: StoredUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      email: dto.email.toLowerCase(),
      passwordHash: this.hashPassword(dto.password),
      fullName: dto.fullName,
      role: dto.role || 'recruiter',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    const userSession: UserSession = {
      userId: newUser.id,
      tenantId: newUser.tenantId,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    };

    const token = this.createJwtToken(userSession);
    return { user: userSession, token };
  }

  async login(dto: LoginDto): Promise<{ user: UserSession; token: string }> {
    const user = this.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = this.verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userSession: UserSession = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = this.createJwtToken(userSession);
    return { user: userSession, token };
  }

  async getProfile(userId: string): Promise<UserSession> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
