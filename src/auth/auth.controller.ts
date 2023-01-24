import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('google/login')
  async googleClientLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }
}
