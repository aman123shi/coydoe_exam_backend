import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';

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
  async getNotification(id: mongoose.Schema.Types.ObjectId | string) {
    return await this.notificationModel
      .find({ userId: id })
      //we are sorting by updatedAt property is because sometimes
      //we update notifications instead of creating new notifications
      .sort({ updatedAt: -1 });
  }

  async getNewNotificationsCount(id: mongoose.Schema.Types.ObjectId | string) {
    let count = await this.notificationModel
      .find({ userId: id, isViewed: false })
      .count();
    return { count };
  }
  //this is used to update already created notification for
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

  //
  async submitViewedNotification(notificationIds: string[]): Promise<any> {
    return await this.notificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isViewed: true } },
    );
  }

  async submitOpenedNotification(notificationId: string) {
    return await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isOpened: true },
      { new: true },
    );
  }
}
