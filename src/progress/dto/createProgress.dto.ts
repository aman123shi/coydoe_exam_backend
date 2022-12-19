export class CreateProgressDto {
  courseId?: number;
  year?: number;
  userId?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  skippedQuestions?: number;
  totalTimes?: number;
  lastPage?: number;
}
