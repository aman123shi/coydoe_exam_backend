import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { request } from 'http';
import mongoose from 'mongoose';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotification(@Req() request: ExpressRequest) {
    return await this.notificationService.getNotification(request.userId);
  }
}
