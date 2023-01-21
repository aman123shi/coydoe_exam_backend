import { Controller, Get } from '@nestjs/common';
import { LeaderBoardService } from './leaderBoard.service';

@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private leaderBoardService: LeaderBoardService) {}

  @Get('insert-leader-board')
  async insertPoint() {
    return await this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
      '63bf0bf6c5e510b0c1afcecd',
      5,
    );
  }

  @Get('daily')
  async getDaily() {
    return await this.leaderBoardService.getDailyLeaderBoard();
  }

  @Get('weekly')
  async getWeekly() {
    return await this.leaderBoardService.getWeeklyLeaderBoard();
  }

  @Get('monthly')
  async getMonthly() {
    return await this.leaderBoardService.getMonthlyLeaderBoard();
  }
}
