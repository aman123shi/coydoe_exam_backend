import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/AdminLogin.dto';
import { CreateAdminDTo } from './dto/createAdmin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  async signup(@Body() createAdminDto: CreateAdminDTo) {
    return await this.adminService.signUp(createAdminDto);
  }

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return await this.adminService.login(adminLoginDto);
  }
}
