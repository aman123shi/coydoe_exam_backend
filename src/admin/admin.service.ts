import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CreateAdminDTo } from './dto/createAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { responseBuilder } from '@app/utils/http-response-builder';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminNotification,
  AdminNotificationDocument,
} from './schemas/adminNotification.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(AdminNotification.name)
    private adminNotificationModel: Model<AdminNotificationDocument>,
  ) {}

  generateJWT(id: any): string {
    return sign({ id, isAdmin: true }, 'JWT_SECRET');
  }

  async signUp(createAdminDTo: CreateAdminDTo) {
    let newAdmin = new this.adminModel();
    Object.assign(newAdmin, createAdminDTo);
    let adminExist = await this.adminModel.findOne({
      username: newAdmin.username,
    });

    if (adminExist) {
      throw new HttpException(
        'Admin already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
    await newAdmin.save();
    delete newAdmin.password;
    let response = {
      ...newAdmin,
      token: this.generateJWT(newAdmin._id),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  async login(loginDto: AdminLoginDto) {
    let admin = await this.adminModel.findOne({ username: loginDto.username });

    if (!admin) {
      throw new HttpException(
        'Incorrect Phone or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect Phone or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete admin.password;
    let response = {
      ...admin,
      token: this.generateJWT(admin._id),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  async getNewNotifications() {
    return await this.adminNotificationModel
      .find({ count: { $gt: 0 } })
      .populate('clerkId');
  }

  async incrementDataInsertionNotification(clerkId: any) {
    return await this.adminNotificationModel.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        $inc: { count: 1 },
      },
      { upsert: true },
    );
  }

  async resetNotifications(notificationIds: string[]): Promise<any> {
    return await this.adminNotificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { count: 0 },
    );
  }

  async insertSample() {
    return await this.incrementDataInsertionNotification('');
  }
}
