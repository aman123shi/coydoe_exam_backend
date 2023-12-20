import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserChallenge,
  UserChallengeDocument,
} from './schemas/user-challenge.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AdminChallenge,
  AdminChallengeDocument,
} from './schemas/admin-challenge.schema';

@Injectable()
export class UserChallengeService {
  constructor(
    @InjectModel(UserChallenge.name)
    private userChallengeModel: Model<UserChallengeDocument>,
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
  ) {}

  async getLevelChallenge(level: number, userId: any): Promise<any> {
    // check  if active challenge exist for this level
    // if no active challenge is available
    // return 404 no challenge found for this period
    // if exists check if opponent unassigned user exist then assign the unassigned user as opponent
    // if unassigned user does not exists play your challenge and wait for other challenger to be assigned to you
    // if opponent not found from the previous generate new questions
    // and return challenge id and questions or give opponent questions for the player

    const challengeExist = await this.adminChallengeModel.findOne({
      level: level,
      isActive: true,
    });

    if (!challengeExist) throw new NotFoundException();

    const unAssignedUser = await this.userChallengeModel.findOne({
      opponentAssigned: false,
    });
    const newUserChallenge = new this.userChallengeModel({
      adminChallenge: challengeExist._id,
      userId,
    });

    if (unAssignedUser) {
      unAssignedUser.opponentId = userId;
      unAssignedUser.opponentAssigned = true;
      await unAssignedUser.save();

      newUserChallenge.opponentAssigned = true;
      newUserChallenge.opponentId = unAssignedUser._id as any;
      newUserChallenge.questions = unAssignedUser.questions;
    } else {
    }
    await newUserChallenge.save();
  }
}
