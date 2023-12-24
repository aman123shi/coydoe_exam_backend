import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdminChallengeDTO {
  @IsNotEmpty()
  readonly level: number;

  @IsNotEmpty()
  readonly label: string;

  @IsOptional()
  readonly numberOfQuestions: number;

  @IsNotEmpty()
  readonly startDate: Date;

  @IsNotEmpty()
  readonly endDate: Date;

  @IsOptional()
  readonly isActive: boolean;
}
