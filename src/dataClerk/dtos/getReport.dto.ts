import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class GetDataInsertionReportDto {
  @IsNotEmpty()
  @IsMongoId()
  clerkId: string;

  @IsNotEmpty()
  @IsOptional()
  durationInDays = 30;
}
