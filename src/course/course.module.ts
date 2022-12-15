import { ExamCategoryModule } from '@app/exam-category/exam-category.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from '@app/course/course.controller';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';
import { CourseSubExamCategoryEntity } from './courseSubExamCategory.entity';
import { SubExamCategoryModule } from '@app/sub-exam-category/sub-exam-category.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    TypeOrmModule.forFeature([CourseEntity, CourseSubExamCategoryEntity]),
    SubExamCategoryModule,
    forwardRef(() => ExamCategoryModule),
  ],
  exports: [CourseService],
})
export class CourseModule {}
