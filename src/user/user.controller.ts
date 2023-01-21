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
  @Get('/leader-board/:range')
  async getLeaderBoard(@Param('range') range: string) {
    return await this.userService.getUsersByOrder(range);
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
