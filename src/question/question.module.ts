import { forwardRef, Module } from '@nestjs/common';
import { DirectionController } from '@app/question/direction.controller';
import { DirectionService } from '@app/question/direction.service';
import { GroupedQuestionController } from '@app/question/groupedQuestion.controller';
import { GroupedQuestionService } from '@app/question/groupedQuestion.service';
import { QuestionController } from '@app/question/question.controller';
import { QuestionService } from '@app/question/question.service';
import { CourseModule } from '@app/course/course.module';
import { ProgressModule } from '@app/progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import {
  GroupedQuestion,
  GroupedQuestionSchema,
} from './schemas/groupedQuestion.schema';
import { Direction, DirectionSchema } from './schemas/direction.schema';

@Module({
  controllers: [
    QuestionController,
    DirectionController,
    GroupedQuestionController,
  ],
  providers: [QuestionService, DirectionService, GroupedQuestionService],
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: GroupedQuestion.name, schema: GroupedQuestionSchema },
      { name: Direction.name, schema: DirectionSchema },
    ]),
    CourseModule,
    forwardRef(() => ProgressModule),
  ],
  exports: [QuestionService, GroupedQuestionService],
})
export class QuestionModule {}
