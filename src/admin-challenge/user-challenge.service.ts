import { Injectable } from '@nestjs/common';
import {
  UserChallenge,
  UserChallengeDocument,
} from './schemas/user-challenge.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserChallengeService {
  constructor(
    @InjectModel(UserChallenge.name)
    private userChallengeModel: Model<UserChallengeDocument>,
  ) {}

  async getLevelChallenge(level: number): Promise<any> {
    // check  if active challenge exist for this level
    // if no active challenge is available
    // return 404 no challenge found for this period
    // if exists check if opponent unassigned user exist then assign the unassigned user as opponent
    // if unassigned user does not exists play your challenge and wait for other challenger to be assigned to you
    // if opponent not found from the previous generate new questions
    // and return challenge id and questions or give opponent questions for the player
  }
}
