import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schemas/exercise.schema';
import mongoose, { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import { GetExercisesDto } from './dto/getExercises.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}

  async getExercises(getExercisesDto: GetExercisesDto) {
    return await this.exerciseModel.find(getExercisesDto);
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    let newExercise = new this.exerciseModel();
    Object.assign(newExercise, createExerciseDto);
    return await newExercise.save();
  }

  async updateExercise(
    id: mongoose.Schema.Types.ObjectId,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    return await this.exerciseModel.findByIdAndUpdate(id, updateExerciseDto);
  }

  async deleteExercise(id: mongoose.Schema.Types.ObjectId) {
    return await this.exerciseModel.findByIdAndDelete(id);
  }
}
