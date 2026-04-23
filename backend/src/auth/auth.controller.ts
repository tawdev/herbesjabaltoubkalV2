import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController initialized');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const admin = await this.authService.validateAdmin(
      body.username,
      body.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(admin, 'admin');
  }

  @Post('user/register')
  async registerUser(@Body() body: any) {
    return this.authService.registerUser(body);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() body: any) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, 'user');
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { access_token, user } = await this.authService.googleLogin(req);
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('ERROR: FRONTEND_URL environment variable is missing!');
      // In production, we MUST have this. If missing, we fallback to a safe default or log error.
    }
    const targetUrl = frontendUrl || 'http://localhost:3000';
    return res.redirect(`${targetUrl}/login?token=${access_token}&user=${JSON.stringify(user)}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @Post('profile/update')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }
}
