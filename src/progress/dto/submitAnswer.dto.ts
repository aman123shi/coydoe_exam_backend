import { IsInt, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsInt()
  readonly courseId: number;

  @IsNotEmpty()
  @IsInt()
  readonly year: 2014;

  @IsNotEmpty()
  answers: {
    questionID: number;
    skipped: boolean;
    answer?: string;
  }[];

  submittedPage: number;
}
