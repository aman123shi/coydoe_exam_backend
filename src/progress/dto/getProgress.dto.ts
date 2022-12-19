import { IsNotEmpty } from 'class-validator';

export class GetProgressDto {
  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  year: number;
}
