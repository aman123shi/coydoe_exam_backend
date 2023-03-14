import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { GetExercisesDto } from './dto/getExercises.dto';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import mongoose from 'mongoose';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post('get-all')
  async getExercises(@Body() getExercisesDto: GetExercisesDto) {
    return await this.exerciseService.getExercises(getExercisesDto);
  }

  @Post('create')
  async createExercises(@Body() createExercisesDto: CreateExerciseDto) {
    return await this.exerciseService.createExercise(createExercisesDto);
  }

  @Put('update/:id')
  async updateExercises(
    @Body() updateExercisesDto: UpdateExerciseDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.exerciseService.updateExercise(id, updateExercisesDto);
  }

  @Delete('remove/:id')
  async deleteExerciseDto(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.exerciseService.deleteExercise(id);
  }
}
