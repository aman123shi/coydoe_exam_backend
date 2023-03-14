import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseQuestionDto } from './createExerciseQuestion.dto';

export class UpdateExerciseQuestionDto extends PartialType(
  CreateExerciseQuestionDto,
) {}
