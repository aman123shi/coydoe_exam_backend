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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  generateJWT(data: any): string {
    return sign(data, JWT_SECRET);
  }

  async getOnlineUsers() {
    return await this.userModel.find();
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
    return await this.userModel.findById(id);
  }
}
