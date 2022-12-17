import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/loginUser.dto';
import { responseBuilder } from '@app/utils/http-response-builder';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  generateJWT(phone: string): string {
    return sign({ phone }, 'JWT_SECRET');
  }

  async signUp(createUserDTo: CreateUserDto) {
    let newUser = new UserEntity();
    Object.assign(newUser, createUserDTo);
    let userExist = await this.userRepository.findOne({
      where: [{ phone: newUser.phone }],
    });
    if (userExist) {
      throw new HttpException(
        'User already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await this.userRepository.save(newUser);
    delete newUser.password;
    let response = {
      ...newUser,
      token: this.generateJWT(newUser.phone),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async login(loginDto: UserLoginDto) {
    let admin = await this.userRepository.findOne({
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
