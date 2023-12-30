import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserChallengeService } from './user-challenge.service';
import { CreateUserChallengeDTO } from './dtos/createUserChallenge.dto';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { SubmitUserChallengeDto } from './dtos/submitUserChallenge.dto';

@Controller('user-challenge')
export class UserChallengeController {
  constructor(private userChallengeService: UserChallengeService) {}

  @Post('create')
  async createAndGetChallenge(
    @Body() createUserChallengeDTO: CreateUserChallengeDTO,
    @Req() request: ExpressRequest,
  ) {
    return await this.userChallengeService.getLevelChallenge(
      request.userId,
      createUserChallengeDTO,
    );
  }

  @Put('submit')
  async submitChallengeQuestion(
    @Body() submitUserChallengeDto: SubmitUserChallengeDto,
    @Req() request: ExpressRequest,
  ) {
    return await this.userChallengeService.submitChallengeQuestion(
      request.userId,
      submitUserChallengeDto,
    );
  }

  // getPlayingUsers

  @Get('get-level-players/:level')
  async getLevelPlayers(@Param('level') level: number) {
    return await this.userChallengeService.getPlayingUsers(level);
  }
}
