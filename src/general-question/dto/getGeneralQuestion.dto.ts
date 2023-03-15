import { IsOptional } from 'class-validator';

export class GetGeneralQuestionDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
