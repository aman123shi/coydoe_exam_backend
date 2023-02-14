import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataClerkSchema } from './schemas/dataClerk.schema';
import { DataClerkAuthService } from './dataClerkAuth.service';
import { QuestionModule } from '@app/question/question.module';
import { DataClerkController } from './dataClerk.controller';

@Module({
  controllers: [DataClerkController],
  providers: [DataClerkAuthService],
  imports: [
    MongooseModule.forFeature([
      { name: DataClerk.name, schema: DataClerkSchema },
    ]),
    QuestionModule,
  ],
  exports: [],
})
export class DataClerk {}
