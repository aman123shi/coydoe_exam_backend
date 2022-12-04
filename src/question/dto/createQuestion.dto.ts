import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsOptional()
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
  @IsOptional()
  readonly subExamCategory?: number; //natural social
}
/*
{
  "questionText":"",
  "option_a":"",
  "option_b":"",
  "option_c":"",
  "option_d":"",
  "answer":"",
  "description":"",
  "year":2015,
  "course":3
}
*/
