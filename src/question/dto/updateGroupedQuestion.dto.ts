import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupedQuestionDto } from './createGroupedQuestion.dto';

export class UpdateGroupedQuestionDto extends PartialType(
  CreateGroupedQuestionDto,
) {}
