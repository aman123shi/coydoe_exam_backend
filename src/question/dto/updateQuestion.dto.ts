import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './createQuestion.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
