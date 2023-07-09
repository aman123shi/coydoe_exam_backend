import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CreateAdminDTo } from './dto/createAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { responseBuilder } from '@app/question/utils/http-response-builder';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  AdminNotification,
  AdminNotificationDocument,
} from './schemas/adminNotification.schema';
import { UpdateAdminDTo } from './dto/updateAdmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(AdminNotification.name)
    private adminNotificationModel: Model<AdminNotificationDocument>,
  ) {}

  generateJWT(id: any): string {
    return sign({ id, isAdmin: true }, process.env.JWT_SECRET);
  }

  async signUp(createAdminDTo: CreateAdminDTo) {
    const newAdmin = new this.adminModel();
    Object.assign(newAdmin, createAdminDTo);
    const adminExist = await this.adminModel.findOne({
      phone: newAdmin.phone,
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
    const admin = newAdmin.toObject({ getters: true });
    const response = {
      ...admin,
      token: this.generateJWT(newAdmin._id),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async login(loginDto: AdminLoginDto) {
    const admin = await this.adminModel.findOne({ phone: loginDto.username });

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
    const loggedInAdmin = admin.toObject({ getters: true });
    const response = {
      ...loggedInAdmin,
      token: this.generateJWT(admin._id),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  async getNewNotifications() {
    return await this.adminNotificationModel
      .find({ count: { $gt: 0 } })
      .populate('clerkId', ['username']);
  }

  async incrementDataInsertionNotification(clerkId: any) {
    return await this.adminNotificationModel.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        $inc: { count: 1 },
      },
      { upsert: true, new: true },
    );
  }

  async resetNotifications(notificationIds: string[]): Promise<any> {
    return await this.adminNotificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { count: 0 },
    );
  }

  async insertSample() {
    return await this.incrementDataInsertionNotification(
      '63f09552e64c513045f245ac',
    );
  }

  async updateAdminCredentials(
    id: mongoose.Schema.Types.ObjectId,
    updateAdminDto: UpdateAdminDTo,
  ) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(updateAdminDto.password, salt);

    return await this.adminModel.findByIdAndUpdate(
      id,
      { username: updateAdminDto.username, password },
      { new: true },
    );
  }
}
