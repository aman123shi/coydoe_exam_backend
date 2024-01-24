import { IsOptional } from 'class-validator';

export class GetAdminChallengeDTO {
  @IsOptional()
  readonly level: number;

  @IsOptional()
  readonly startDate: Date;

  @IsOptional()
  readonly endDate: Date;

  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly size: number;

  @IsOptional()
  readonly isActive: boolean;
}
