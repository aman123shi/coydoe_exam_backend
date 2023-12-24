import { InjectModel } from '@nestjs/mongoose';
import {
  AdminChallenge,
  AdminChallengeDocument,
} from './schemas/admin-challenge.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAdminChallengeDTO } from './dtos/createAdminChallenge.dto';

@Injectable()
export class AdminChallengeService {
  constructor(
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
  ) {}

  async createAdminChallenge(createAdminChallengeDto: CreateAdminChallengeDTO) {
    const newAdminChallenge = new this.adminChallengeModel();
    Object.assign(newAdminChallenge, createAdminChallengeDto);
    await newAdminChallenge.save();
    const cleanAdminChallenge = newAdminChallenge.toObject({ getters: true });

    return { data: cleanAdminChallenge };
  }
}
