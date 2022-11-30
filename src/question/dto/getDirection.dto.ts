import { IsInt, IsNotEmpty } from 'class-validator';

export class GetDirectionDto {
  @IsNotEmpty()
  @IsInt()
  readonly courseId: number;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;
}
