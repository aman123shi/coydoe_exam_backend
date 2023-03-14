import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './schemas/exercise.schema';
import {
  ExerciseQuestion,
  ExerciseQuestionSchema,
} from './schemas/exerciseQuestion.schema';
import { ExerciseService } from './exercise.service';
import { ExerciseQuestionService } from './exerciseQuestion.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseQuestionController } from './exerciseQuestion.controller';

@Module({
  providers: [ExerciseService, ExerciseQuestionService],
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: ExerciseQuestion.name, schema: ExerciseQuestionSchema },
    ]),
  ],
  controllers: [ExerciseController, ExerciseQuestionController],
})
export class ExerciseModule {}
