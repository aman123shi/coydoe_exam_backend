import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { CreateAdminDTo } from './dto/createAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { responseBuilder } from '@app/utils/http-response-builder';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  generateJWT(phone: string): string {
    return sign({ phone }, 'JWT_SECRET');
  }

  async signUp(createAdminDTo: CreateAdminDTo) {
    let newAdmin = new Admin();
    Object.assign(newAdmin, createAdminDTo);
    let adminExist = await this.adminModel.findOne({ phone: newAdmin.phone });
    // let adminExist = await this.adminRepository.findOne({
    //   where: [{ phone: newAdmin.phone }],
    // });
    if (adminExist) {
      throw new HttpException(
        'Admin already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
    await this.adminRepository.save(newAdmin);
    delete newAdmin.password;
    let response = {
      ...newAdmin,
      token: this.generateJWT(newAdmin.phone),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
  async login(loginDto: AdminLoginDto) {
    let admin = await this.adminRepository.findOne({
      where: [{ phone: loginDto.phone }],
    });
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
      token: this.generateJWT(admin.phone),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
}
