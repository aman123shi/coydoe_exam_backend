import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataClerk, DataClerkSchema } from './schemas/dataClerk.schema';
import { DataClerkService } from './dataClerk.service';
import { DataClerkController } from './dataClerk.controller';
import { QuestionModule } from '@app/question/question.module';

@Module({
  controllers: [DataClerkController],
  providers: [DataClerkService],
  imports: [
    MongooseModule.forFeature([
      { name: DataClerk.name, schema: DataClerkSchema },
    ]),
    forwardRef(() => QuestionModule),
  ],
  exports: [DataClerkService],
})
export class DataClerkModule {}
