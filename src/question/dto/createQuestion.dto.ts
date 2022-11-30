import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
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
  readonly image?: string;

  @IsNotEmpty()
  readonly description?: string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsNotEmpty()
  @IsInt()
  readonly course: number; //Biology Math

  @IsNotEmpty()
  @IsInt()
  readonly subExamCategory?: number; //natural social
}
