import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('google/login')
  async googleClientLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }
  @Post('facebook/login')
  async facebookLogin(@Body('token') token: string) {
    return this.authService.facebookLogin(token);
  }

  @Post('linkedin/login')
  async linkedinLogin(@Body('token') token: string) {
    return this.authService.linkedinLogin(token);
  }
}
