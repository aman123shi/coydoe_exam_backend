import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/loginUser.dto';
import { responseBuilder } from '@app/question/utils/http-response-builder';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserStatus } from './types/updateUserstatus.types';
import { UpdateUserDto } from './dto/updateUser.dto';
import { MailingService } from '@app/mailing/mailing.service';
import { generateOTPCode } from '@app/utils';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { UserLoginByEmailDto } from './dto/loginByEmail.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private mailerService: MailingService,
  ) {}

  generateJWT(data: any): string {
    return sign(data, process.env.JWT_SECRET);
  }

  async getAllOnlineUsers(userId: mongoose.Schema.Types.ObjectId) {
    const users = await this.userModel.find({ _id: { $nin: [userId] } });
    return { data: users, total: users.length };
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
  async signUp(createUserDTo: CreateUserDto, imagePath: string | undefined) {
    const newUser = new this.userModel();
    Object.assign(newUser, createUserDTo);
    if (imagePath) newUser.image = imagePath;
    const userExist = await this.userModel.findOne({ phone: newUser.phone });
    if (userExist) {
      throw new HttpException(
        'User already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    const user = newUser.toObject({ getters: true });
    delete user.password;
    const response = {
      ...user,
      token: this.generateJWT({ id: newUser._id, phone: newUser.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async signUpByEmail(
    createUserDTo: CreateUserDto,
    imagePath: string | undefined,
  ) {
    const newUser = new this.userModel();
    Object.assign(newUser, createUserDTo);
    if (imagePath) newUser.image = imagePath;
    const userExist = await this.userModel.findOne({
      email: newUser.email,
      isEmailVerified: true,
    });
    if (userExist) {
      throw new HttpException(
        'User already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.userModel.findOneAndDelete({
      email: newUser.email,
    });

    const otpCode = generateOTPCode();
    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(newUser.password, salt);
    newUser.otpCode = otpCode;

    this.mailerService.sendMail({ to: newUser.email, code: otpCode });
    console.log(
      ' email sent **************************************************',
    );

    await newUser.save();
    const user = newUser.toObject({ getters: true });
    delete user.password;
    const response = {
      ...user,
      token: this.generateJWT({ id: newUser._id, phone: newUser.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  async verifyEmail(confirmEmailDto: ConfirmEmailDto) {
    const userExist = await this.userModel.findOne({
      email: confirmEmailDto.email,
      otpCode: confirmEmailDto.otp,
    });
    if (!userExist) {
      throw new HttpException('User Donot exist', HttpStatus.NOT_FOUND);
    }
    const isPasswordCorrect = await bcrypt.compare(
      confirmEmailDto.password,
      userExist.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    console.log('helloe');
    userExist.isEmailVerified = true;
    userExist.otpCode = '';
    userExist.save();

    const loggedInUser = userExist.toObject({ getters: true });
    delete loggedInUser.password;
    const response = {
      ...loggedInUser,
      token: this.generateJWT({ id: loggedInUser._id, email: userExist.email }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  // verify email

  async uploadPaymentImage(
    userId: mongoose.Schema.Types.ObjectId,
    imagePath: string,
  ) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { paymentImageUrl: imagePath, paymentStatus: 'pending' },
      { new: true },
    );
  }

  async login(loginDto: UserLoginDto) {
    const user = await this.userModel.findOne({ phone: loginDto.phone });
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

    const loggedInUser = user.toObject({ getters: true });
    delete loggedInUser.password;
    const response = {
      ...loggedInUser,
      token: this.generateJWT({ id: loggedInUser._id, phone: user.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  // login by email
  async loginByEmail(loginDto: UserLoginByEmailDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email,
      isEmailVerified: true,
    });
    if (!user) {
      throw new HttpException(
        'Incorrect email or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect email or Password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const loggedInUser = user.toObject({ getters: true });
    delete loggedInUser.password;
    const response = {
      ...loggedInUser,
      token: this.generateJWT({ id: loggedInUser._id, phone: user.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  // email
  async getUserById(id: mongoose.Schema.Types.ObjectId) {
    return await this.userModel.findById(id).select('-password');
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('-password');
  }

  async getUserByFacebookId(fbId: string) {
    return await this.userModel
      .findOne({ facebookId: fbId })
      .select('-password');
  }

  async getUserByLinkedinId(linkedinId: string) {
    return await this.userModel.findOne({ linkedinId });
  }

  async getUserRewardPoint(id: mongoose.Schema.Types.ObjectId) {
    const user = await this.userModel.findById(id).select('rewardPoint');
    return { rewardPoint: user.rewardPoint };
  }

  async createUser(userDto: any) {
    const newUser = new this.userModel();
    Object.assign(newUser, userDto);
    const user = await newUser.save();
    return user.toObject({ getters: true });
  }

  async updateUser(
    id: mongoose.Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    delete updateUserDto?.password;
    return await this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  async deleteUser(id: mongoose.Schema.Types.ObjectId) {
    return await this.userModel.findByIdAndRemove({ _id: id });
  }

  async notifyUser(id: mongoose.Schema.Types.ObjectId) {
    return 'hello' + id;
  }

  async isPremiumActive(id: mongoose.Schema.Types.ObjectId) {
    const user = await this.userModel.findById(id);
    return {
      data: { isActive: user?.paymentStatus == 'active' ? true : false },
    };
  }
}
