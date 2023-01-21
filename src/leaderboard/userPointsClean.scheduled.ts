import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { LeaderBoardService } from './leaderBoard.service';
import {
  DailyLeaderBoard,
  DailyLeaderBoardDocument,
} from './schemas/dailyLeaderBoard.schema';
import {
  MonthlyLeaderBoard,
  MonthlyLeaderBoardDocument,
} from './schemas/monthlyLeaderBoard.schema';
import {
  WeeklyLeaderBoard,
  WeeklyLeaderBoardDocument,
} from './schemas/weeklyLeaderBoard.schema';

@Injectable()
export class UserPointsCleanupService {
  private readonly logger = new Logger(UserPointsCleanupService.name);
  constructor(
    private leaderBoardService: LeaderBoardService,
    @InjectModel(DailyLeaderBoard.name)
    private dailyLeaderBoardModel: Model<DailyLeaderBoardDocument>,
    @InjectModel(WeeklyLeaderBoard.name)
    private weeklyLeaderBoardModel: Model<WeeklyLeaderBoardDocument>,
    @InjectModel(MonthlyLeaderBoard.name)
    private monthlyLeaderBoardModel: Model<MonthlyLeaderBoardDocument>,
  ) {
    this.dropAndInitLeaderBoard();
  }
  @Cron('10 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 10');
  }

  //clean if user point created at is older than 30 days
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanOutDatedUserPoints() {
    await this.leaderBoardService.deleteOlderEntriesOfTheMonth();
    this.dropAndInitLeaderBoard();
  }

  async dropOldLeaderBoard() {
    await this.dailyLeaderBoardModel.deleteMany();
    await this.weeklyLeaderBoardModel.deleteMany();
    await this.monthlyLeaderBoardModel.deleteMany();
  }

  async initLeaderBoards() {
    let dailyReports = await this.leaderBoardService.generateDailyLeaderBoard();
    let weeklyReports =
      await this.leaderBoardService.generateWeeklyLeaderBoard();
    let monthlyReports =
      await this.leaderBoardService.generateMonthlyLeaderBoard();
    for (const dailyReport of dailyReports) {
      let userReport = new this.dailyLeaderBoardModel();
      Object.assign(userReport, {
        userId: dailyReport._id,
        points: dailyReport.points,
      });
      userReport.save();
    }

    for (const weeklyReport of weeklyReports) {
      let userReport = new this.weeklyLeaderBoardModel();
      Object.assign(userReport, {
        userId: weeklyReport._id,
        points: weeklyReport.points,
      });
      userReport.save();
    }

    for (const monthlyReport of monthlyReports) {
      let userReport = new this.monthlyLeaderBoardModel();
      Object.assign(userReport, {
        userId: monthlyReport._id,
        points: monthlyReport.points,
      });
      userReport.save();
    }
  }
  async dropAndInitLeaderBoard() {
    await this.dropOldLeaderBoard();
    await this.initLeaderBoards();
  }
}
