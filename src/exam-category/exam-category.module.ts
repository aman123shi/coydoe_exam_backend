import { CourseModule } from '@app/course/course.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamCategoryController } from './exam-category.controller';
import { ExamCategoryEntity } from './exam-category.entity';
import { ExamCategoryService } from './exam-category.service';

@Module({
  controllers: [ExamCategoryController],
  providers: [ExamCategoryService],
  imports: [
    TypeOrmModule.forFeature([ExamCategoryEntity]),
    forwardRef(() => CourseModule),
  ],
  exports: [ExamCategoryService],
})
export class ExamCategoryModule {}
//Entrance Coc Bank
