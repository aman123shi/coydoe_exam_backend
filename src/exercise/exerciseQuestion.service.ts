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
import { GetExerciseChaptersDto } from './dto/getChapters.dto';

@Injectable()
export class ExerciseQuestionService {
  constructor(
    @InjectModel(ExerciseQuestion.name)
    private exerciseQuestionModel: Model<ExerciseQuestionDocument>,
  ) {}

  async getExerciseQuestions(getExerciseQuestionDto: GetExerciseQuestionDto) {
    const skip =
      getExerciseQuestionDto.size * (getExerciseQuestionDto.page - 1);

    const questions = await this.exerciseQuestionModel
      .find({
        grade: getExerciseQuestionDto.grade,
        courseId: getExerciseQuestionDto.courseId,
      })
      .sort({ chapter: 1 })
      .skip(skip)
      .limit(getExerciseQuestionDto.size);

    const total = await this.exerciseQuestionModel.count({
      grade: getExerciseQuestionDto.grade,
      courseId: getExerciseQuestionDto.courseId,
    });
    return { questions, total };
  }

  async getExerciseQuestionsForMobile(
    getExerciseQuestionDto: GetExerciseQuestionDto,
  ) {
    const skip =
      getExerciseQuestionDto.size * (getExerciseQuestionDto.page - 1);
    const questions = await this.exerciseQuestionModel
      .find({
        grade: getExerciseQuestionDto.grade,
        courseId: getExerciseQuestionDto.courseId,
        chapter: getExerciseQuestionDto.chapter,
      })
      .sort({ questionNumber: 1 })
      .skip(skip)
      .limit(getExerciseQuestionDto.size);

    const total = await this.exerciseQuestionModel.count({
      grade: getExerciseQuestionDto.grade,
      courseId: getExerciseQuestionDto.courseId,
      chapter: getExerciseQuestionDto.chapter,
    });
    return { questions, total };
  }

  async getAvailableChapters(getExerciseChaptersDto: GetExerciseChaptersDto) {
    const chapters = await this.exerciseQuestionModel
      .find({
        grade: getExerciseChaptersDto.grade,
        courseId: getExerciseChaptersDto.courseId,
      })
      .select('chapter')
      .distinct('chapter');

    return { chapters, total: chapters.length };
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
