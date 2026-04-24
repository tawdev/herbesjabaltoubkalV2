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
    
    // Redirect to frontend with token and optional redirect path
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('ERROR: FRONTEND_URL environment variable is missing!');
    }
    const targetUrl = frontendUrl || 'http://localhost:3000';
    
    // Check if we have a redirect parameter from the original request (via state or query)
    // Note: Passport-google-oauth20 doesn't automatically pass query params to callback.
    // However, we can use the 'state' if we want to be robust. 
    // For now, let's see if we can get it from the request if the user passed it.
    const redirectTo = req.query.state || ''; // Usually stored in state
    
    let finalUrl = `${targetUrl}/login?token=${access_token}&user=${JSON.stringify(user)}`;
    if (req.query.state) {
      finalUrl += `&redirect=${encodeURIComponent(req.query.state as string)}`;
    }

    return res.redirect(finalUrl);
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
