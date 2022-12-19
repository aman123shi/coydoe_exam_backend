export class CreatePageDto {
  courseId?: number;
  year?: number;
  userId?: number;
  page?: number;
  isSubmitted?: boolean;
  pageSize?: number;
  startTime?: number;
  submittedTime?: Date;
}
