import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';
import { Challenge, ChallengeDocument } from './schema/challenge.schema';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
  ) {}
  async createChallenge({ courseId, userId, opponentId }) {
    let newChallenge = new this.challengeModel();
    // Object.assign(newChallenge, createChallengeDto);
    //get random question s
    //iterate and save question ids with their answer
    //send questions to the user with
    //{challengeId,and questions with challenge points  }
    return await newChallenge.save();
  }

  async getChallengeById(id: mongoose.Schema.Types.ObjectId) {
    return await this.challengeModel.findById(id);
  }
  async getChallengeQuestions(challengeId: mongoose.Schema.Types.ObjectId) {}
  async updateChallenge(
    id: mongoose.Schema.Types.ObjectId,
    updateChallengeDto: UpdateChallengeDto,
  ) {
    let updatedChallenge = await this.challengeModel.findOneAndUpdate(
      { _id: id },
      updateChallengeDto,
    );
    return updatedChallenge;
  }
}
