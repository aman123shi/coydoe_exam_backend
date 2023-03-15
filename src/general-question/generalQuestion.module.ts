import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeneralQuestion,
  GeneralQuestionSchema,
} from './schemas/generalQuestion.schema';
import { GeneralQuestionController } from './generalQuestion.controller';
import { GeneralQuestionService } from './generalQuestion.service';

@Module({
  controllers: [GeneralQuestionController],
  providers: [GeneralQuestionService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneralQuestion.name, schema: GeneralQuestionSchema },
    ]),
  ],
})
export class GeneralQuestionModule {}
