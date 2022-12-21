import mongoose from 'mongoose';

export class CreatePageDto {
  courseId?: mongoose.Schema.Types.ObjectId;
  year?: number;
  userId?: mongoose.Schema.Types.ObjectId;
  page?: number;
  isSubmitted?: boolean;
  pageSize?: number;
  startTime?: number;
  submittedTime?: Date;
}
