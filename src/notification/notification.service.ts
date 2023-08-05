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
    const data = await this.notificationModel
      .find({ userId: id })
      .sort({ updatedAt: -1 })
      .populate('opponentUser')
      .populate('userId ');
    return { data, total: data.length };
  }

  async getNewNotificationsCount(id: mongoose.Schema.Types.ObjectId | string) {
    const count = await this.notificationModel
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
    const newNotification = new this.notificationModel();
    Object.assign(newNotification, createNotification);
    return await newNotification.save();
  }

  async updateNotification(
    id: mongoose.Schema.Types.ObjectId,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    const notification = await this.notificationModel.findById(id);
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

  async deleteNotification(condition: any): Promise<any> {
    return await this.notificationModel.deleteOne(condition);
  }

  async deleteNotificationById(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    return await this.notificationModel.deleteOne({ _id: id });
  }
}
