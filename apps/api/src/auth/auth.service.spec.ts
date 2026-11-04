import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

/** Synthetic test credentials — no real personal data. */
const TEST_EMAIL = 'test.user@example.com';
const TEST_PASSWORD = 'SecurePass!99';
const TEST_TENANT = 'acme_corp';
const TEST_NAME = 'Test User';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-only-for-unit-tests',
          signOptions: { expiresIn: '7d' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('register() creates a user and returns a valid JWT', async () => {
    const result = await service.register({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      tenantName: TEST_TENANT,
      fullName: TEST_NAME,
    });

    expect(result.user.email).toBe(TEST_EMAIL);
    expect(result.token).toBeTruthy();

    // Verify the token is a real JWT signed with the test secret
    const decoded = jwtService.verify<{ sub: string; email: string }>(result.token);
    expect(decoded.email).toBe(TEST_EMAIL);
  });

  it('login() with correct password returns a JWT', async () => {
    // Register first so the user exists
    await service.register({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      tenantName: TEST_TENANT,
      fullName: TEST_NAME,
    });

    const result = await service.login({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(result.user.email).toBe(TEST_EMAIL);
    expect(result.token).toBeTruthy();

    const decoded = jwtService.verify<{ sub: string; email: string }>(result.token);
    expect(decoded.email).toBe(TEST_EMAIL);
  });

  it('login() with wrong password throws UnauthorizedException', async () => {
    await service.register({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      tenantName: TEST_TENANT,
      fullName: TEST_NAME,
    });

    await expect(
      service.login({ email: TEST_EMAIL, password: 'WrongPassword!' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('verifyJwtToken() with an expired token throws UnauthorizedException', () => {
    // Sign a token that expired 1 second ago
    const expiredToken = jwtService.sign(
      { sub: 'usr_test', email: TEST_EMAIL, tenantId: 't1', fullName: TEST_NAME, role: 'recruiter' },
      { expiresIn: '-1s' },
    );

    expect(() => service.verifyJwtToken(expiredToken)).toThrow(UnauthorizedException);
  });

  it('register() throws BadRequestException on duplicate email', async () => {
    await service.register({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      tenantName: TEST_TENANT,
      fullName: TEST_NAME,
    });

    await expect(
      service.register({
        email: TEST_EMAIL,
        password: 'AnotherPass!1',
        tenantName: TEST_TENANT,
        fullName: TEST_NAME,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
