import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserLoginDto } from './dto/loginUser.dto';
import { ExpressRequest } from './types/expressRequest.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
      }),
    )
    file: Express.Multer.File,
    //  @Body() createUserDto: CreateUserDto,
  ) {
    return file.filename + ' ' + file.originalname;
    //await this.userService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.userService.login(userLoginDto);
  }
}
