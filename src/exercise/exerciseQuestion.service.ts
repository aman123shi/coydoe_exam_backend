import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import {
  ExerciseQuestion,
  ExerciseQuestionDocument,
} from './schemas/exerciseQuestion.schema';
import { CreateExerciseQuestionDto } from './dto/createExerciseQuestion.dto';
import { UpdateExerciseQuestionDto } from './dto/updateExerciseQuestion.dto';
import { GetExerciseQuestionDto } from './dto/getExerciseQuestion';

@Injectable()
export class ExerciseQuestionService {
  constructor(
    @InjectModel(ExerciseQuestion.name)
    private exerciseQuestionModel: Model<ExerciseQuestionDocument>,
  ) {}

  async getExerciseQuestions(getExerciseQuestionDto: GetExerciseQuestionDto) {
    const skip =
      getExerciseQuestionDto.size * (getExerciseQuestionDto.page - 1);
    return await this.exerciseQuestionModel
      .find({
        grade: getExerciseQuestionDto.grade,
        courseId: getExerciseQuestionDto.courseId,
      })
      .sort({ chapter: 1 })
      .skip(skip)
      .size(getExerciseQuestionDto.size);
  }

  async createExerciseQuestion(
    createExerciseQuestionDto: CreateExerciseQuestionDto,
  ) {
    const newExerciseQuestion = new this.exerciseQuestionModel();
    Object.assign(newExerciseQuestion, createExerciseQuestionDto);
    return await newExerciseQuestion.save();
  }

  async updateExerciseQuestion(
    id: mongoose.Schema.Types.ObjectId,
    updateExerciseQuestionDto: UpdateExerciseQuestionDto,
  ) {
    return await this.exerciseQuestionModel.findByIdAndUpdate(
      id,
      updateExerciseQuestionDto,
    );
  }

  async deleteExerciseQuestion(id: mongoose.Schema.Types.ObjectId) {
    return await this.exerciseQuestionModel.findByIdAndDelete(id);
  }
}
