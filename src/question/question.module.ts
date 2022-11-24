import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [TypeOrmModule.forFeature([QuestionEntity])],
})
export class QuestionModule {}
