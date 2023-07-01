import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ExerciseQuestionService } from './exerciseQuestion.service';
import mongoose from 'mongoose';
import { CreateExerciseQuestionDto } from './dto/createExerciseQuestion.dto';
import { UpdateExerciseQuestionDto } from './dto/updateExerciseQuestion.dto';
import { GetExerciseQuestionDto } from './dto/getExerciseQuestion';
import { GetExerciseChaptersDto } from './dto/getChapters.dto';

@Controller('exercise-questions')
export class ExerciseQuestionController {
  constructor(
    private readonly exerciseQuestionService: ExerciseQuestionService,
  ) {}

  @Post('get')
  async getExerciseQuestions(
    @Body() getExerciseQuestionDto: GetExerciseQuestionDto,
  ) {
    return await this.exerciseQuestionService.getExerciseQuestions(
      getExerciseQuestionDto,
    );
  }

  @Post('get/mobile')
  async getExerciseQuestionsMobile(
    @Body() getExerciseQuestionDto: GetExerciseQuestionDto,
  ) {
    return await this.exerciseQuestionService.getExerciseQuestionsForMobile(
      getExerciseQuestionDto,
    );
  }

  @Post('get/chapters')
  async getAvailableChapters(
    @Body() getExerciseChaptersDto: GetExerciseChaptersDto,
  ) {
    return await this.exerciseQuestionService.getAvailableChapters(
      getExerciseChaptersDto,
    );
  }

  @Post('create')
  async createExerciseQuestion(
    @Body() createExerciseQuestionDto: CreateExerciseQuestionDto,
  ) {
    return await this.exerciseQuestionService.createExerciseQuestion(
      createExerciseQuestionDto,
    );
  }

  @Put('/:id')
  async updateExerciseQuestion(
    @Body() updateExerciseQuestionDto: UpdateExerciseQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.exerciseQuestionService.updateExerciseQuestion(
      id,
      updateExerciseQuestionDto,
    );
  }

  @Delete('/:id')
  async deleteExerciseQuestion(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.exerciseQuestionService.deleteExerciseQuestion(id);
  }
}
