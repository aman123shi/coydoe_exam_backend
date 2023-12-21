import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminChallenge,
  AdminChallengeSchema,
} from './schemas/admin-challenge.schema';
import {
  UserChallenge,
  UserChallengeSchema,
} from './schemas/user-challenge.schema';
import { UserChallengeService } from './user-challenge.service';
import { QuestionModule } from '@app/question/question.module';

@Module({
  providers: [UserChallengeService],
  controllers: [],
  exports: [],
  imports: [
    MongooseModule.forFeature([
      { name: AdminChallenge.name, schema: AdminChallengeSchema },
      { name: UserChallenge.name, schema: UserChallengeSchema },
    ]),
    QuestionModule,
  ],
})
export class AdminChallengeModule {}
