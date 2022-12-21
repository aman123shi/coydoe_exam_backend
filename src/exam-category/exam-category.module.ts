import { CourseModule } from '@app/course/course.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamCategoryController } from './exam-category.controller';
import { ExamCategoryService } from './exam-category.service';
import {
  ExamCategory,
  ExamCategorySchema,
} from './schemas/examCategory.schema';

@Module({
  controllers: [ExamCategoryController],
  providers: [ExamCategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: ExamCategory.name, schema: ExamCategorySchema },
    ]),

    forwardRef(() => CourseModule),
  ],
  exports: [ExamCategoryService],
})
export class ExamCategoryModule {}
//Entrance Coc Bank
