import { IsInt, IsNotEmpty } from 'class-validator';

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
  readonly image?: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsNotEmpty()
  @IsInt()
  readonly questionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly direction: number; //to which direction it belongs

  @IsNotEmpty()
  @IsInt()
  readonly subExamCategory?: number; //natural social
}
