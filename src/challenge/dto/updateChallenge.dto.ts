import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './createChallenge.dto';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}
