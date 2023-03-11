import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from '@app/admin/admin.service';
import { AdminLoginDto } from '@app/admin/dto/adminLogin.dto';
import { CreateAdminDTo } from '@app/admin/dto/createAdmin.dto';
import { Public } from './decorators/publicRoute.decorators';
import mongoose from 'mongoose';
import { UpdateAdminDTo } from '@app/admin/dto/updateAdmin.dto';
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

  @Get('notifications')
  async getNotifications() {
    return await this.adminService.getNewNotifications();
  }

  @Put('reset-notifications')
  async resetNotifications(@Body('notificationIds') notificationIds: string[]) {
    return await this.adminService.resetNotifications(notificationIds);
  }

  @Get('insert-sample')
  async insertSample() {
    return await this.adminService.insertSample();
  }

  @Post('update-credentials/:id')
  async updateCredentials(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updateAdminDto: UpdateAdminDTo,
  ) {
    return this.adminService.updateAdminCredentials(id, updateAdminDto);
  }
}
