import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupedQuestionDto {
  @IsNotEmpty()
  readonly questionText: string;

  @IsNotEmpty()
  readonly option_a: string;

  @IsNotEmpty()
  readonly option_b: string;

  @IsNotEmpty()
  readonly option_c: string;

  @IsNotEmpty()
  readonly option_d: string;

  @IsNotEmpty()
  readonly answer: string;

  @IsNotEmpty()
  @IsOptional()
  readonly image?: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsNotEmpty()
  @IsInt()
  readonly courseId: number;

  @IsNotEmpty()
  @IsInt()
  readonly questionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly direction: number; //to which direction it belongs

  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  readonly subExamCategory?: number; //natural social
}
