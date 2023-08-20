import { Controller, Get, Req } from '@nestjs/common';
import { LeaderBoardService } from './leaderBoard.service';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';

@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private leaderBoardService: LeaderBoardService) {}

  @Get('insert-leader-board')
  async insertPoint() {
    return await this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
      '63bf0b6ac5e510b0c1afceca',
      5,
    );
  }

  @Get('daily')
  async getDaily(@Req() request: ExpressRequest) {
    return await this.leaderBoardService.getDailyLeaderBoard(request.userId);
  }

  @Get('weekly')
  async getWeekly(@Req() request: ExpressRequest) {
    return await this.leaderBoardService.getWeeklyLeaderBoard(request.userId);
  }

  @Get('monthly')
  async getMonthly(@Req() request: ExpressRequest) {
    return await this.leaderBoardService.getMonthlyLeaderBoard(request.userId);
  }
}
