import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserLoginDto } from './dto/loginUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getOnlineUsers();
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
