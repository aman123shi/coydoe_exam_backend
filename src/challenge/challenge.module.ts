import { QuestionModule } from '@app/question/question.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { Challenge, ChallengeSchema } from './schema/challenge.schema';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  imports: [
    QuestionModule,
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
})
export class ChallengeModule {}
