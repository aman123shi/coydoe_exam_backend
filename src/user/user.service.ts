import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/loginUser.dto';
import { responseBuilder } from '@app/utils/http-response-builder';
import { JWT_SECRET } from '@app/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserStatus } from './types/updateUserstatus.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  generateJWT(data: any): string {
    return sign(data, JWT_SECRET);
  }

  async getAllOnlineUsers(userId: mongoose.Schema.Types.ObjectId) {
    return await this.userModel.find({ _id: { $nin: [userId] } });
  }
  async getUsersByRegion(countryId: string, regionId: string) {
    return await this.userModel
      .find({ country: countryId, region: regionId })
      .limit(10);
  }
  async getUsersByOrder(order: string) {
    //1 for ascending order -1 for descending order
    let sortIN: 1 | -1 = 1;
    if (order == 'dsc') sortIN = -1;

    return await this.userModel.find().sort({ rewardPoint: sortIN }).limit(10);
  }
  async updateUserStatus({ userId, isOnline, socketId }: UpdateUserStatus) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { isOnline, socketId },
      { new: true },
    );
  }
  async getUserStatus(userId: string) {
    return await this.userModel
      .findById(userId)
      .select(['isOnline', 'socketId']);
  }
  async signUp(createUserDTo: CreateUserDto) {
    let newUser = new this.userModel();
    Object.assign(newUser, createUserDTo);
    let userExist = await this.userModel.findOne({ phone: newUser.phone });
    if (userExist) {
      throw new HttpException(
        'User already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    let user = newUser.toObject({ getters: true });
    delete user.password;
    let response = {
      ...user,
      token: this.generateJWT({ id: newUser._id, phone: newUser.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async login(loginDto: UserLoginDto) {
    let user = await this.userModel.findOne({ phone: loginDto.phone });
    if (!user) {
      throw new HttpException(
        'Incorrect Phone or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect Phone or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let loggedInUser = user.toObject({ getters: true });
    delete loggedInUser.password;
    let response = {
      ...loggedInUser,
      token: this.generateJWT({ id: loggedInUser._id, phone: user.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async getUserById(id: mongoose.Schema.Types.ObjectId) {
    return await this.userModel.findById(id).select('-password');
  }

  async getUserRewardPoint(id: mongoose.Schema.Types.ObjectId) {
    let user = await this.userModel.findById(id).select('rewardPoint');
    return { rewardPoint: user.rewardPoint };
  }

  async filterByTimeRange(query: string) {
    if (query == 'daily') {
      return await this.userModel
        .find({ updatedAt: { $gte: new Date() } })
        .sort({ rewardPoint: -1 })
        .limit(10);
    } else if (query == 'weekly') {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      return await this.userModel
        .find({ updatedAt: { $gte: lastWeek } })
        .sort({ rewardPoint: -1 })
        .limit(10);
    } else if (query == 'monthly') {
      const now = new Date();
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      return await this.userModel
        .find({ updatedAt: { $gte: lastMonth } })
        .sort({ rewardPoint: -1 })
        .limit(10);
    }
    //return all time scorers
    else {
      return await this.userModel.find().sort({ rewardPoint: 1 }).limit(10);
    }
  }
}
