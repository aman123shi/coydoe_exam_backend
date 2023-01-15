import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserLoginDto } from './dto/loginUser.dto';
import { ExpressRequest } from './types/expressRequest.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAllUsers(@Req() request: ExpressRequest) {
    return await this.userService.getAllOnlineUsers(request.userId);
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
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.userService.login(userLoginDto);
  }
}
