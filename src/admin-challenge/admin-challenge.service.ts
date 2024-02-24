import { InjectModel } from '@nestjs/mongoose';
import {
  AdminChallenge,
  AdminChallengeDocument,
} from './schemas/admin-challenge.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAdminChallengeDTO } from './dtos/createAdminChallenge.dto';
import { GetAdminChallengeDTO } from './dtos/getAdminChallenge.dto';
import {
  FixedChallenges,
  FixedChallengesDocument,
} from './schemas/fixed-challenges.schema';
import { CreateFixedChallengeDTO } from './dtos/createFixedChallenge.dto';

@Injectable()
export class AdminChallengeService {
  constructor(
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
    @InjectModel(FixedChallenges.name)
    private fixedChallengeModel: Model<FixedChallengesDocument>,
  ) {}

  async createAdminChallenge(createAdminChallengeDto: CreateAdminChallengeDTO) {
    const newAdminChallenge = new this.adminChallengeModel();
    Object.assign(newAdminChallenge, createAdminChallengeDto);
    await newAdminChallenge.save();
    const cleanAdminChallenge = newAdminChallenge.toObject({ getters: true });

    return { data: cleanAdminChallenge };
  }

  async getAdminChallenge(getAdminChallengeDto: GetAdminChallengeDTO) {
    const page = getAdminChallengeDto?.page ?? 1;
    const limit = getAdminChallengeDto?.size ?? 10;
    const skip = (page - 1) * limit;
    const matchQuery: any = {};

    if (getAdminChallengeDto?.level)
      matchQuery.level = getAdminChallengeDto?.level;

    if (getAdminChallengeDto?.startDate && getAdminChallengeDto?.endDate) {
      matchQuery.startDate = { $gte: getAdminChallengeDto?.startDate };
      matchQuery.endDate = { $lte: getAdminChallengeDto?.endDate };
    }

    if (
      getAdminChallengeDto.isActive !== undefined &&
      getAdminChallengeDto.isActive !== null
    ) {
      matchQuery.isActive = getAdminChallengeDto.isActive;
    }
    console.log(matchQuery);
    const adminChallenges = await this.adminChallengeModel
      .find(matchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.adminChallengeModel.count(matchQuery);
    return { data: adminChallenges, total };
  }
  //

  async deleteAdminChallenge(id: any) {
    const adminChallenge = await this.adminChallengeModel
      .findByIdAndRemove(id)
      .exec();

    return { data: adminChallenge };
  }

  async getAdminChallengeById(id: any) {
    const adminChallenge = await this.adminChallengeModel.findById(id).exec();
    return adminChallenge;
  }

  async setFixedChallenge(createFixedChallengeDTO: CreateFixedChallengeDTO) {
    const newFixedChallenge = await this.fixedChallengeModel.findOneAndUpdate(
      {
        level: createFixedChallengeDTO.level,
      },
      createFixedChallengeDTO,
      { upsert: true },
    );

    const cleanAdminChallenge = newFixedChallenge.toObject({ getters: true });

    return { data: cleanAdminChallenge };
  }

  async getFixedChallenge() {
    const fixedChallenges = await this.fixedChallengeModel.find();
    return { data: fixedChallenges };
  }

  async deleteFixedChallenge(level: any) {
    const fixedChallenges = await this.fixedChallengeModel.findOneAndRemove({
      level,
    });
    return { data: fixedChallenges };
  }
}
