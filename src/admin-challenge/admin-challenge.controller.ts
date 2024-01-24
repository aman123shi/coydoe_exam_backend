import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAdminChallengeDTO } from './dtos/createAdminChallenge.dto';
import { AdminChallengeService } from './admin-challenge.service';
import { GetAdminChallengeDTO } from './dtos/getAdminChallenge.dto';

@Controller('admin-challenge')
export class AdminChallengeController {
  constructor(private adminChallengeService: AdminChallengeService) {}

  @Get('')
  async getAdminChallenge(@Body() getAdminChallengeDto: GetAdminChallengeDTO) {
    return await this.adminChallengeService.getAdminChallenge(
      getAdminChallengeDto,
    );
  }

  @Post('create')
  async createAdminChallenge(
    @Body() createAdminChallengeDto: CreateAdminChallengeDTO,
  ) {
    return await this.adminChallengeService.createAdminChallenge(
      createAdminChallengeDto,
    );
  }
}
