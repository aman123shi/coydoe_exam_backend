import { Controller, Get, Param } from '@nestjs/common';
import mongoose from 'mongoose';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:id')
  async getNotification(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.notificationService.getNotification(id);
  }
}
