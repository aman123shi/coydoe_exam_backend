import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGeneralQuestionDto {
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

  @IsOptional()
  questionImage?: string;

  @IsOptional()
  descriptionImage?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly questionNumber: number;
}
