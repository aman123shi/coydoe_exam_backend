import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DataClerkService } from './dataClerk.service';
import { CreateDataClerkDTO } from './dtos/CreateDataClerkDTO';
import { LoginDataClerkDTO } from './dtos/loginDataClerkDto';
import { Public } from '@app/admin/decorators/publicRoute.decorators';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { GetDataInsertionReportDto } from './dtos/getReport.dto';

@Controller('data-clerk')
export class DataClerkController {
  constructor(private readonly dataClerkAuthService: DataClerkService) {}

  @Get()
  async getClerk(@Req() req: ExpressRequest) {
    return await this.dataClerkAuthService.getClerk(req.userId);
  }

  @Get('system-info')
  async getClerkAndSystemInfo() {
    return await this.dataClerkAuthService.getClerkAndSystemInfo();
  }

  @Post('public-login')
  @Public()
  async publicUserLogin(@Body() loginDataClerkDto: LoginDataClerkDTO) {
    return await this.dataClerkAuthService.publicClerkLogin(loginDataClerkDto);
  }

  @Post('signup')
  @Public()
  async signup(@Body() createDataClerkDto: CreateDataClerkDTO) {
    return await this.dataClerkAuthService.createAccount(createDataClerkDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDataClerkDto: LoginDataClerkDTO) {
    return await this.dataClerkAuthService.login(loginDataClerkDto);
  }

  @Post('get/data-insertion-report')
  async generateDataInsertionReport(
    @Body() getReportDto: GetDataInsertionReportDto,
  ) {
    return await this.dataClerkAuthService.generateDataInsertionReport(
      getReportDto.clerkId,
      getReportDto.durationInDays,
    );
  }
}
