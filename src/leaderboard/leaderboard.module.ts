import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaderBoardController } from './leaderboard.controller';
import { LeaderBoardService } from './leaderBoard.service';
import {
  DailyLeaderBoard,
  DailyLeaderBoardSchema,
} from './schemas/dailyLeaderBoard.schema';
import {
  MonthlyLeaderBoard,
  MonthlyLeaderBoardSchema,
} from './schemas/monthlyLeaderBoard.schema';
import { UserPoints, UserPointsSchema } from './schemas/usersPoints.schema';
import {
  WeeklyLeaderBoard,
  WeeklyLeaderBoardSchema,
} from './schemas/weeklyLeaderBoard.schema';
import { UserPointsCleanupService } from './userPointsClean.scheduled';

@Module({
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService, UserPointsCleanupService],
  imports: [
    MongooseModule.forFeature([
      { name: UserPoints.name, schema: UserPointsSchema },
      { name: DailyLeaderBoard.name, schema: DailyLeaderBoardSchema },
      { name: WeeklyLeaderBoard.name, schema: WeeklyLeaderBoardSchema },
      { name: MonthlyLeaderBoard.name, schema: MonthlyLeaderBoardSchema },
    ]),
  ],
  exports: [LeaderBoardService, UserPointsCleanupService],
})
export class LeaderBoardModule {}
