import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GeneralQuestion,
  GeneralQuestionDocument,
} from './schemas/generalQuestion.schema';
import mongoose, { Model } from 'mongoose';
import { CreateGeneralQuestionDto } from './dto/createGeneralQuestion.dto';
import { UpdateGeneralQuestionDto } from './dto/updateGeneralQuestion.dto';
import { DataClerkService } from '@app/dataClerk/dataClerk.service';
import { AdminService } from '@app/admin/admin.service';

@Injectable()
export class GeneralQuestionService {
  constructor(
    @InjectModel(GeneralQuestion.name)
    private generalQuestionModel: Model<GeneralQuestionDocument>,
    private readonly dataClerkService: DataClerkService,
    private readonly adminService: AdminService,
  ) {}

  async getGeneralQuestions(
    page: number,
    limit: number,
    examCategory: mongoose.Schema.Types.ObjectId,
  ) {
    const count = await this.generalQuestionModel
      .find({ examCategory })
      .count();
    const questions = await this.generalQuestionModel
      .find({ examCategory })
      .skip((page - 1) * limit)
      .limit(limit);

    return { count, questions };
  }

  async getRandomGeneralQuestions(
    examCategory: mongoose.Schema.Types.ObjectId,
  ) {
    const count = await this.generalQuestionModel
      .find({ examCategory })
      .count();
    const questions = await this.generalQuestionModel
      .aggregate([
        {
          $match: {
            examCategory: new mongoose.Types.ObjectId(examCategory.toString()),
          },
        },
        { $sample: { size: 10 } },
      ])
      .exec();

    return { count, questions };
  }

  async createGeneralQuestions(
    createGeneralQuestionsDto: CreateGeneralQuestionDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const newQuestion = new this.generalQuestionModel();
    Object.assign(newQuestion, createGeneralQuestionsDto);
    await this.dataClerkService.incrementQuestionEntered(userId);
    //insert data entry report for that day from dataClerkService(insert report)
    await this.dataClerkService.insertReport({
      clerkId: userId,
      courseId: '648f652433537c7cf862c72e',
    });
    //increment admin notification for that user AdminService
    await this.adminService.incrementDataInsertionNotification(userId);

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
