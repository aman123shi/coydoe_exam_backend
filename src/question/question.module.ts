import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionEntity } from './direction.entity';
import { GroupedQuestionEntity } from './groupedQuestion.entity';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      DirectionEntity,
      GroupedQuestionEntity,
    ]),
  ],
})
export class QuestionModule {}
