import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GeneralQuestion,
  GeneralQuestionDocument,
} from './schemas/generalQuestion.schema';
import mongoose, { Model } from 'mongoose';
import { CreateGeneralQuestionDto } from './dto/createGeneralQuestion.dto';
import { UpdateGeneralQuestionDto } from './dto/updateGeneralQuestion.dto';

@Injectable()
export class GeneralQuestionService {
  constructor(
    @InjectModel(GeneralQuestion.name)
    private generalQuestionModel: Model<GeneralQuestionDocument>,
  ) {}

  async getGeneralQuestions(page: number, limit: number) {
    let count = await this.generalQuestionModel.find().count();
    let questions = await this.generalQuestionModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    return { count, questions };
  }

  async createGeneralQuestions(
    createGeneralQuestionsDto: CreateGeneralQuestionDto,
  ) {
    let newQuestion = new this.generalQuestionModel();
    Object.assign(newQuestion, createGeneralQuestionsDto);
    return await newQuestion.save();
  }

  async updateGeneralQuestion(
    id: mongoose.Schema.Types.ObjectId,
    updateGeneralQuestionDto: UpdateGeneralQuestionDto,
  ) {
    return await this.generalQuestionModel.findByIdAndUpdate(
      id,
      updateGeneralQuestionDto,
    );
  }

  async deleteGeneralQuestion(id: mongoose.Schema.Types.ObjectId) {
    await this.generalQuestionModel.findByIdAndDelete(id);
  }
}
