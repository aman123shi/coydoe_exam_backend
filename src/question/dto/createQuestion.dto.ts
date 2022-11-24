export class CreateQuestionDto {
  readonly questionText: string;

  readonly option_a: string;

  readonly option_b: string;

  readonly option_c: string;

  readonly option_d: string;

  readonly answer: string;

  readonly image?: string;

  readonly description?: string;

  readonly year: number;

  readonly course: number; //Biology Math

  readonly subExamCategory?: number; //natural social
}
