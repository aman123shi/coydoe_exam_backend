import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  AdminChallenge,
  AdminChallengeDocument,
} from './schemas/admin-challenge.schema';
import { Model } from 'mongoose';
import { startOfDay } from 'date-fns';
import { UserChallengeService } from './user-challenge.service';
import {
  ChallengeWinners,
  ChallengeWinnersDocument,
} from './schemas/challenge-winners.schema';
import { AdminChallengeService } from './admin-challenge.service';
import { NotificationService } from '@app/notification/notification.service';

Injectable();
export class AdminChallengeCronService {
  constructor(
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
    @InjectModel(ChallengeWinners.name)
    private challengeWinnerModel: Model<ChallengeWinnersDocument>,
    private readonly userChallengeService: UserChallengeService,
    private readonly adminChallengeService: AdminChallengeService,
    private notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async makeActiveScheduledChallenges() {
    await this.adminChallengeModel.updateMany(
      {
        isActive: false,
        hasBeenActivated: false,
        startDate: { $gte: startOfDay(new Date()) },
      },
      {
        $set: {
          isActive: true,
          hasBeenActivated: true,
        },
      },
    );
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async expireScheduledChallenges() {
    // get active but end date expires challenges
    const adminChallenges = await this.adminChallengeModel.find({
      isActive: true,
      hasBeenActivated: true,
      endDate: { $lte: startOfDay(new Date()) },
    });

    console.log(`expiring due date admin challenges ${adminChallenges.length}`);

    for (let i = 0; i < adminChallenges.length; i++) {
      const adminChallenge = adminChallenges[i];
      console.log(`expiring due date admin each challenges ${i}`);
      // if final round send notification for top 3
      //    if (adminChallenge.level === 10) {
      const userChallenges =
        await this.userChallengeService.getChallengeTopPlayers({
          limit: 32,
          adminChallengeId: adminChallenge._id,
        });

      const winners = userChallenges.map((userChallenge, index) => {
        return {
          userId: userChallenge.userId,
          point: userChallenge.point,
          rank: index + 1,
        };
      });

      const challengeWinners = new this.challengeWinnerModel();
      Object.assign(challengeWinners, {
        adminChallenge: adminChallenge._id,
        winners,
      });

      await challengeWinners.save();

      // send notification for top 3
      let topPlayersCounter = 0;
      let numberOfUsersToBeNotified = 0;

      if (adminChallenge.level === 10) numberOfUsersToBeNotified = 3;
      else if (adminChallenge.level === 7) numberOfUsersToBeNotified = 32;
      else if (adminChallenge.level === 8) numberOfUsersToBeNotified = 16;
      else if (adminChallenge.level === 9) numberOfUsersToBeNotified = 8;

      let currentUser = userChallenges[0];

      const adminChallengeData =
        await this.adminChallengeService.getAdminChallengeById(
          adminChallenge._id,
        );

      while (topPlayersCounter < numberOfUsersToBeNotified && currentUser) {
        console.log(
          `while expiring due date admin each challenges ${topPlayersCounter}`,
        );
        const userChallenge =
          await this.userChallengeService.getChallengeUserByUserId(
            currentUser._id,
          );

        await this.notificationService.createNotification({
          userId: currentUser?.userId,
          message: `you have won the ${
            adminChallengeData.label ?? 'competition'
          } challenge of level ${adminChallengeData.level} with rank ${
            topPlayersCounter + 1
          }`,
          notificationType: 'inform',
          opponentUser: userChallenge?.opponentId,
        });

        topPlayersCounter++;
        currentUser =
          userChallenges.length > topPlayersCounter
            ? userChallenges[topPlayersCounter]
            : null;
      }

      // expire the current challenge
      adminChallenge.isActive = false;
      await adminChallenge.save();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async selectQualifiedUsersForNextLevel() {}
}
