import { Body, Controller, Post } from '@nestjs/common';
import { DataClerkAuthService } from './dataClerkAuth.service';
import { CreateDataClerkDTO } from './dtos/CreateDataClerkDTO';
import { LoginDataClerkDTO } from './dtos/loginDataClerkDto';

@Controller('data-clerk')
export class DataClerkController {
  constructor(private readonly dataClerkAuthService: DataClerkAuthService) {}

  @Post('signup')
  async signup(@Body() createDataClerkDto: CreateDataClerkDTO) {
    return await this.dataClerkAuthService.createAccount(createDataClerkDto);
  }

  @Post('login')
  async login(@Body() loginDataClerkDto: LoginDataClerkDTO) {
    return await this.dataClerkAuthService.login(
      loginDataClerkDto.username,
      loginDataClerkDto.password,
    );
  }
}
