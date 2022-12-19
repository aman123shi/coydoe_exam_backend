import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/loginUser.dto';
import { responseBuilder } from '@app/utils/http-response-builder';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  generateJWT(data: any): string {
    return sign({ data }, JWT_SECRET);
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
      token: this.generateJWT({ id: newUser.id, phone: newUser.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }

  async login(loginDto: UserLoginDto) {
    let user = await this.userRepository.findOne({
      where: [{ phone: loginDto.phone }],
    });
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
    delete user.password;
    let response = {
      ...user,
      token: this.generateJWT({ id: user.id, phone: user.phone }),
    };
    return responseBuilder({ statusCode: HttpStatus.OK, body: response });
  }
}
