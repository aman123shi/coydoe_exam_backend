import { ExamCategoryModule } from '@app/exam-category/exam-category.module';
import { forwardRef, Module } from '@nestjs/common';
import { CourseController } from '@app/course/course.controller';
import { CourseService } from '@app/course/course.service';
import { SubExamCategoryModule } from '@app/sub-exam-category/sub-exam-category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import {
  CourseSubExamCategory,
  CourseSubExamCategorySchema,
} from './schemas/courseSubExamCategory.schema';
@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: CourseSubExamCategory.name, schema: CourseSubExamCategorySchema },
    ]),

    SubExamCategoryModule,
    forwardRef(() => ExamCategoryModule),
  ],
  exports: [CourseService],
})
export class CourseModule {}
