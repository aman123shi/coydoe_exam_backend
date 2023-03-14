import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './createExercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
