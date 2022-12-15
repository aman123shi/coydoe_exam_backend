import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionController } from '@app/question/direction.controller';
import { DirectionEntity } from '@app/question/direction.entity';
import { DirectionService } from '@app/question/direction.service';
import { GroupedQuestionController } from '@app/question/groupedQuestion.controller';
import { GroupedQuestionEntity } from '@app/question/groupedQuestion.entity';
import { GroupedQuestionService } from '@app/question/groupedQuestion.service';
import { QuestionController } from '@app/question/question.controller';
import { QuestionEntity } from '@app/question/question.entity';
import { QuestionService } from '@app/question/question.service';
import { CourseModule } from '@app/course/course.module';

@Module({
  controllers: [
    QuestionController,
    DirectionController,
    GroupedQuestionController,
  ],
  providers: [QuestionService, DirectionService, GroupedQuestionService],
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      DirectionEntity,
      GroupedQuestionEntity,
    ]),
    CourseModule,
  ],
})
export class QuestionModule {}
