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

@Controller('admin-challenge')
export class AdminChallengeController {
  constructor(private adminChallengeService: AdminChallengeService) {}

  @Get('')
  async getAdminChallenge(@Query() getAdminChallengeDto: GetAdminChallengeDTO) {
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

  @Delete('/:id')
  async deleteAdminChallenge(@Param('id') id: any) {
    return await this.adminChallengeService.deleteAdminChallenge(id);
  }
}
