import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeneralQuestion,
  GeneralQuestionSchema,
} from './schemas/generalQuestion.schema';
import { GeneralQuestionController } from './generalQuestion.controller';
import { GeneralQuestionService } from './generalQuestion.service';
import { DataClerkModule } from '@app/dataClerk/dataClerk.module';
import { AdminModule } from '@app/admin/admin.module';

@Module({
  controllers: [GeneralQuestionController],
  providers: [GeneralQuestionService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneralQuestion.name, schema: GeneralQuestionSchema },
    ]),
    DataClerkModule,
    AdminModule,
  ],
})
export class GeneralQuestionModule {}
