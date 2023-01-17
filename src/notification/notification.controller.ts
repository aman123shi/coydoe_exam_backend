import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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

  @Post('submit-viewed')
  async submitViewedNotifications(
    @Body()
    notificationDto: {
      notificationIds: string[];
    },
  ) {
    return await this.notificationService.submitViewedNotification(
      notificationDto.notificationIds,
    );
  }
  @Post('submit-opened')
  async submitOpenedNotification(
    @Body()
    notificationDto: {
      notificationId: mongoose.Schema.Types.ObjectId;
    },
  ) {
    return await this.notificationService.submitOpenedNotification(
      notificationDto.notificationId,
    );
  }
}
