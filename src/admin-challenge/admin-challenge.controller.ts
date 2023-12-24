import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminChallengeDTO } from './dtos/createAdminChallenge.dto';
import { AdminChallengeService } from './admin-challenge.service';

@Controller('admin-challenge')
export class AdminChallengeController {
  constructor(private adminChallengeService: AdminChallengeService) {}

  @Post('create')
  async createAdminChallenge(
    @Body() createAdminChallengeDto: CreateAdminChallengeDTO,
  ) {
    return await this.adminChallengeService.createAdminChallenge(
      createAdminChallengeDto,
    );
  }
}
