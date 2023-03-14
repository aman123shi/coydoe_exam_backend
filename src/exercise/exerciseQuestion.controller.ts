import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExerciseQuestionService } from './exerciseQuestion.service';
import mongoose from 'mongoose';
import { CreateExerciseQuestionDto } from './dto/createExerciseQuestion.dto';
import { UpdateExerciseQuestionDto } from './dto/updateExerciseQuestion.dto';

@Controller('exercise-questions')
export class ExerciseQuestionController {
  constructor(
    private readonly exerciseQuestionService: ExerciseQuestionService,
  ) {}

  @Get('/:exerciseId')
  async getExerciseQuestions(
    @Param('exerciseId') exerciseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.exerciseQuestionService.getExerciseQuestions(exerciseId);
  }

  @Post()
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
