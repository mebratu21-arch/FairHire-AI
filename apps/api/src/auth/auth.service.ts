import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto, UserSession } from './auth.types';

/**
 * In-memory user store.
 * TODO(DB): Replace with Drizzle ORM + Postgres once DatabaseService is wired.
 * Pre-seeded with two synthetic demo accounts (no real personal data).
 */
interface StoredUser {
  id: string;
  tenantId: string;
  email: string;
  /** argon2id hash — unique random salt embedded by argon2.hash() */
  passwordHash: string;
  fullName: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  createdAt: string;
}

@Injectable()
export class AuthService {
  /**
   * Demo seed users are hashed lazily on first use because argon2.hash()
   * is async. The store starts empty; login("recruiter@fairhire.ai",
   * "FairHire2026!") registers the seed user on first call if absent.
   * This is dev-only scaffolding; remove once real DB is in place.
   */
  private users: StoredUser[] = [];

  constructor(private readonly jwtService: JwtService) {}

  /** Hash a plaintext password with argon2id (unique random salt per call). */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  /** Verify a plaintext password against an argon2id hash. */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  /** Sign a JWT using @nestjs/jwt (reads JWT_SECRET from env, 7-day expiry). */
  createJwtToken(user: UserSession): string {
    return this.jwtService.sign({
      sub: user.userId,
      tenantId: user.tenantId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  }

  /** Verify and decode a JWT. Throws UnauthorizedException on any failure. */
  verifyJwtToken(token: string): UserSession {
    try {
      const decoded = this.jwtService.verify<{
        sub: string;
        tenantId: string;
        email: string;
        fullName: string;
        role: 'admin' | 'recruiter' | 'hiring_manager';
      }>(token);
      return {
        userId: decoded.sub,
        tenantId: decoded.tenantId,
        email: decoded.email,
        fullName: decoded.fullName,
        role: decoded.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired session token');
    }
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
      passwordHash: await this.hashPassword(dto.password),
      fullName: dto.fullName,
      role: dto.role ?? 'recruiter',
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

    return { user: userSession, token: this.createJwtToken(userSession) };
  }

  async login(dto: LoginDto): Promise<{ user: UserSession; token: string }> {
    const user = this.users.find((u) => u.email.toLowerCase() === dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await this.verifyPassword(dto.password, user.passwordHash);
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

    return { user: userSession, token: this.createJwtToken(userSession) };
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
