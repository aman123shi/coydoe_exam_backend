import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from '@app/admin/admin.service';
import { AdminLoginDto } from '@app/admin/dto/adminLogin.dto';
import { CreateAdminDTo } from '@app/admin/dto/createAdmin.dto';
import { Public } from './decorators/publicRoute.decorators';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  @Public()
  async signup(@Body() createAdminDto: CreateAdminDTo) {
    return await this.adminService.signUp(createAdminDto);
  }

  @Post('login')
  @Public()
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return await this.adminService.login(adminLoginDto);
  }
}
