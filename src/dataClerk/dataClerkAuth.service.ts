import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataClerk, DataClerkDocument } from './schemas/dataClerk.schema';
import { Model } from 'mongoose';
import { CreateDataClerkDTO } from './dtos/CreateDataClerkDTO';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class DataClerkAuthService {
  constructor(
    @InjectModel(DataClerk.name)
    private dataClerkModel: Model<DataClerkDocument>,
  ) {}
  generateJWT(data: any): string {
    return sign(data, JWT_SECRET);
  }
  async createAccount(createDataClerkDto: CreateDataClerkDTO) {
    let userExist = await this.dataClerkModel.findOne({
      username: createDataClerkDto.username,
    });
    if (userExist) {
      throw new UnprocessableEntityException(
        'Username Taken please choose new',
      );
    }
    let newClerk = new this.dataClerkModel();
    Object.assign(newClerk, createDataClerkDto);
    await newClerk.save();
    return {
      fullName: createDataClerkDto.fullName,
      username: createDataClerkDto.username,
      token: this.generateJWT({ id: newClerk._id }),
    };
  }

  async login(username: string, password: string) {
    let userExist = await this.dataClerkModel.findOne({
      username,
    });
    if (!userExist) {
      throw new UnprocessableEntityException(
        'Username or password Incorrect please Try Again',
      );
    }
    if (userExist.password !== password) {
      throw new UnprocessableEntityException(
        'Username or password Incorrect please Try Again',
      );
    }
    return {
      fullName: userExist.fullName,
      username: userExist.username,
      token: this.generateJWT({ id: userExist._id }),
    };
  }
}
