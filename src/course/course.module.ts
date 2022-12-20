import { ExamCategoryModule } from '@app/exam-category/exam-category.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from '@app/course/course.controller';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';
import { CourseSubExamCategoryEntity } from './courseSubExamCategory.entity';
import { SubExamCategoryModule } from '@app/sub-exam-category/sub-exam-category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    TypeOrmModule.forFeature([CourseEntity, CourseSubExamCategoryEntity]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),

    SubExamCategoryModule,
    forwardRef(() => ExamCategoryModule),
  ],
  exports: [CourseService],
})
export class CourseModule {}
