import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { NotificationGateway } from './notification.gateway';
import {
  NotificationDocument,
  Notification,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}
  //get notifications of a user by his id
  async getNotification(id: mongoose.Schema.Types.ObjectId) {
    return await this.notificationModel.find({ userId: id });
  }
  async getNotificationByChallengeIdAndUserId(
    challengeId: mongoose.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.notificationModel.findOne({
      referenceId: challengeId,
      userId,
    });
  }
  async createNotification(createNotification: CreateNotificationDto) {
    let newNotification = new this.notificationModel();
    Object.assign(newNotification, createNotification);
    return await newNotification.save();
  }

  async updateNotification(
    id: mongoose.Schema.Types.ObjectId,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    let notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new UnprocessableEntityException(
        "can't find Notification with this Id",
      );
    }
    Object.assign(notification, updateNotificationDto);
    return await notification.save();
  }
}
