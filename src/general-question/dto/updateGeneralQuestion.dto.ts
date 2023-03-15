import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralQuestionDto } from './createGeneralQuestion.dto';

export class UpdateGeneralQuestionDto extends PartialType(
  CreateGeneralQuestionDto,
) {}
