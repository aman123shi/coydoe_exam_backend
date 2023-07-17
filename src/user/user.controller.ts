import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserLoginDto } from './dto/loginUser.dto';
import { ExpressRequest } from './types/expressRequest.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';
import mongoose from 'mongoose';
import { UserLoginByEmailDto } from './dto/loginByEmail.dto';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAllUsers(@Req() request: ExpressRequest) {
    return await this.userService.getAllOnlineUsers(request.userId);
  }

  @Get('/get-reward-point')
  async getUserRewardPoint(@Req() request: ExpressRequest) {
    return await this.userService.getUserRewardPoint(request.userId);
  }
  @Get('/get-user-profile')
  async getUserProfile(@Req() request: ExpressRequest) {
    return await this.userService.getUserById(request.userId);
  }

  @Get('/by-region/:countryId/:regionId')
  async getUsersByRegion(
    @Param('countryId') countryId: string,
    @Param('regionId') regionId: string,
  ) {
    return await this.userService.getUsersByRegion(countryId, regionId);
  }

  @Get('/get-by-order/:order')
  async getUsersByOrder(@Param('order') order: string) {
    return await this.userService.getUsersByOrder(order);
  }
  //https://levelup.gitconnected.com/how-we-created-a-real-time-leaderboard-for-a-million-users-555aaa3ccf7b

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async signup(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), //file must be less than 4 mb
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File | undefined,
    @Body() createUserDto: CreateUserDto,
  ) {
    //return file.filename + ' ' + file.originalname;
    return await this.userService.signUp(createUserDto, file?.filename);
  }

  @Post('signup/email')
  @UseInterceptors(FileInterceptor('image'))
  async signupByEmail(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), //file must be less than 4 mb
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File | undefined,
    @Body() createUserDto: CreateUserDto,
  ) {
    //return file.filename + ' ' + file.originalname;
    return await this.userService.signUpByEmail(createUserDto, file?.filename);
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.userService.login(userLoginDto);
  }

  @Post('login/email')
  async loginByEmail(@Body() userLoginDto: UserLoginByEmailDto) {
    return await this.userService.loginByEmail(userLoginDto);
  }
  @Post('verify/email')
  async verifyEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    return await this.userService.verifyEmail(confirmEmailDto);
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.userService.deleteUser(id);
  }

  @Post('upload-payment-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadPaymentImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 30 }), //file must be less than 30 mb
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File | undefined,
    @Req() request: ExpressRequest,
  ) {
    return await this.userService.uploadPaymentImage(
      request.userId,
      file?.filename ?? '',
    );
  }
}
