export class GetQuestionDto {
  readonly course: number;
  readonly year: number;
  readonly subCategory?: number;
  readonly page?: number;
  readonly limit?: number;
}
