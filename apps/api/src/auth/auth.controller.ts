import { Controller, Post, Get, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: any) {
    const { user, token } = await this.authService.register(body);

    // Set secure HTTP-only cookie
    res.cookie('fairhire_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    return {
      status: 'ok',
      user,
      token, // Also provided in payload for cross-environment testing
      message: 'Account registered successfully.',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: any) {
    const { user, token } = await this.authService.login(body);

    // Set secure HTTP-only cookie
    res.cookie('fairhire_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    return {
      status: 'ok',
      user,
      token,
      message: 'Login successful.',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('fairhire_session', { path: '/' });
    return { status: 'ok', message: 'Logged out successfully.' };
  }

  @Get('me')
  async getSession(@Req() req: any) {
    // Check cookie first, fallback to Authorization Bearer header
    const token =
      req.cookies?.['fairhire_session'] ||
      req.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return { authenticated: false, user: null };
    }

    try {
      const user = this.authService.verifyJwtToken(token);
      return { authenticated: true, user };
    } catch {
      return { authenticated: false, user: null };
    }
  }
}
