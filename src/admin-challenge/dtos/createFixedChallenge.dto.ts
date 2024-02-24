import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFixedChallengeDTO {
  @IsNotEmpty()
  readonly level: number;

  @IsOptional()
  readonly minimumPointsRequiredToComplete: number;
}
