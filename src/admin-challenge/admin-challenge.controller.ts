import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateAdminChallengeDTO } from './dtos/createAdminChallenge.dto';
import { AdminChallengeService } from './admin-challenge.service';
import { GetAdminChallengeDTO } from './dtos/getAdminChallenge.dto';
import { CreateFixedChallengeDTO } from './dtos/createFixedChallenge.dto';

@Controller('admin-challenge')
export class AdminChallengeController {
  constructor(private adminChallengeService: AdminChallengeService) {}

  @Get('')
  async getAdminChallenge(@Query() getAdminChallengeDto: GetAdminChallengeDTO) {
    return await this.adminChallengeService.getAdminChallenge(
      getAdminChallengeDto,
    );
  }

  @Get('get/fixed-challenges')
  async getFixedChallenges() {
    return await this.adminChallengeService.getFixedChallenge();
  }

  @Post('create')
  async createAdminChallenge(
    @Body() createAdminChallengeDto: CreateAdminChallengeDTO,
  ) {
    return await this.adminChallengeService.createAdminChallenge(
      createAdminChallengeDto,
    );
  }

  @Post('create/fixed-challenge')
  async createFixedChallenge(
    @Body() createFixedChallengeDTO: CreateFixedChallengeDTO,
  ) {
    return await this.adminChallengeService.setFixedChallenge(
      createFixedChallengeDTO,
    );
  }

  @Delete('/:id')
  async deleteAdminChallenge(@Param('id') id: any) {
    return await this.adminChallengeService.deleteAdminChallenge(id);
  }
}
