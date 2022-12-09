import { ExamCategoryModule } from '@app/exam-category/exam-category.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from '@app/course/course.controller';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    TypeOrmModule.forFeature([CourseEntity]),
    forwardRef(() => ExamCategoryModule),
  ],
  exports: [CourseService],
})
export class CourseModule {}
