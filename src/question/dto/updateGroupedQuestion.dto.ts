export class UpdateGroupedQuestionDto {
  readonly questionText?: string;

  readonly option_a?: string;

  readonly option_b?: string;

  readonly option_c?: string;

  readonly option_d?: string;

  readonly answer?: string;

  readonly image?: string;

  readonly description?: string;

  readonly year?: number;

  readonly questionNumber?: number;

  readonly direction?: number; //to which direction it belongs

  readonly subExamCategory?: number; //natural social
}
