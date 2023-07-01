import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import {
  DailyLeaderBoard,
  DailyLeaderBoardDocument,
} from './schemas/dailyLeaderBoard.schema';
import {
  MonthlyLeaderBoard,
  MonthlyLeaderBoardDocument,
} from './schemas/monthlyLeaderBoard.schema';
import { UserPoints, UserPointsDocument } from './schemas/usersPoints.schema';
import {
  WeeklyLeaderBoard,
  WeeklyLeaderBoardDocument,
} from './schemas/weeklyLeaderBoard.schema';
type UserTotalPoint = {
  _id: mongoose.Schema.Types.ObjectId;
  points: number;
};
@Injectable()
export class LeaderBoardService {
  constructor(
    @InjectModel(UserPoints.name)
    private userPointsModel: Model<UserPointsDocument>,
    @InjectModel(DailyLeaderBoard.name)
    private dailyLeaderBoardModel: Model<DailyLeaderBoardDocument>,
    @InjectModel(WeeklyLeaderBoard.name)
    private weeklyLeaderBoardModel: Model<WeeklyLeaderBoardDocument>,
    @InjectModel(MonthlyLeaderBoard.name)
    private monthlyLeaderBoardModel: Model<MonthlyLeaderBoardDocument>,
  ) {}
  async deleteOlderEntriesOfTheMonth() {
    const userPoint = await this.userPointsModel.deleteMany({
      createdAt: {
        $lte: startOfDay(subDays(new Date(), 30)),
      },
    });
  }
  async insertNewUserPointAndUpdateUserRank(
    userId: string | mongoose.Types.ObjectId,
    point: number,
  ) {
    //update daily insertion if you can get unless create
    const userPoint = await this.userPointsModel.findOneAndUpdate(
      {
        userId,
        createdAt: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
        },
      },
      //if that day point already created increment unless create
      { userId, $inc: { points: point } },
      { upsert: true },
    );

    //then get user daily,weekly and monthly score from userPoints collection

    const userDailyScore: UserTotalPoint[] =
      await this.generateDailyLeaderBoard(userId);

    const userWeeklyScore: UserTotalPoint[] =
      await this.generateWeeklyLeaderBoard(userId);
    const userMonthlyScore: UserTotalPoint[] =
      await this.generateMonthlyLeaderBoard(userId);
    //this is for real time update when single user data is changed
    await this.dailyLeaderBoardModel.findOneAndUpdate(
      { userId },
      { userId, points: userDailyScore[0].points },
      { upsert: true },
    );
    await this.weeklyLeaderBoardModel.findOneAndUpdate(
      { userId },
      { userId, points: userWeeklyScore[0].points },
      { upsert: true },
    );
    await this.monthlyLeaderBoardModel.findOneAndUpdate(
      { userId },
      { userId, points: userMonthlyScore[0].points },
      { upsert: true },
    );
    return userDailyScore;

    // then update daily,weekly and monthly leader board score of that user only if it is positive
  }
  async generateDailyLeaderBoard(
    userId: any = null,
  ): Promise<UserTotalPoint[]> {
    const matchCriteria: any = {
      createdAt: {
        $gte: startOfDay(new Date()),
      },
    };
    if (userId) {
      matchCriteria['userId'] = new mongoose.Types.ObjectId(userId);
    }

    const dailyLeaderBoard = await this.userPointsModel.aggregate([
      {
        $match: matchCriteria,
      },
      { $group: { _id: '$userId', points: { $sum: '$points' } } },
      { $sort: { count: 1 } },
    ]);
    return dailyLeaderBoard;
  }

  async generateWeeklyLeaderBoard(
    userId: any = null,
  ): Promise<UserTotalPoint[]> {
    const matchCriteria: any = {
      createdAt: {
        $gte: startOfDay(subDays(new Date(), 7)),
      },
    };
    if (userId) {
      matchCriteria['userId'] = new mongoose.Types.ObjectId(userId);
    }
    const weeklyLeaderBoard = await this.userPointsModel.aggregate([
      {
        $match: matchCriteria,
      },
      { $group: { _id: '$userId', points: { $sum: '$points' } } },
      { $sort: { count: 1 } },
    ]);
    return weeklyLeaderBoard;
  }
  async generateMonthlyLeaderBoard(
    userId: any = null,
  ): Promise<UserTotalPoint[]> {
    const matchCriteria: any = {
      createdAt: {
        $gte: startOfDay(subDays(new Date(), 30)),
      },
    };
    if (userId) {
      matchCriteria['userId'] = new mongoose.Types.ObjectId(userId);
    }
    const monthlyLeaderBoard = await this.userPointsModel.aggregate([
      {
        $match: matchCriteria,
      },
      { $group: { _id: '$userId', points: { $sum: '$points' } } },
      { $sort: { count: 1 } },
    ]);
    return monthlyLeaderBoard;
  }
  async getDailyLeaderBoard() {
    return await this.dailyLeaderBoardModel
      .find()
      .populate('userId', ['fullName'])
      .sort({ points: -1 })
      .limit(20);
  }
  async getWeeklyLeaderBoard() {
    return await this.weeklyLeaderBoardModel
      .find()
      .populate('userId', ['fullName'])
      .sort({ points: -1 })
      .limit(20);
  }
  async getMonthlyLeaderBoard() {
    return await this.monthlyLeaderBoardModel
      .find()
      .populate('userId', ['fullName'])
      .sort({ points: -1 })
      .limit(20);
  }
}
