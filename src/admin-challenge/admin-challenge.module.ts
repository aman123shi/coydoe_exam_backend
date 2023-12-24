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
import { UserChallengeController } from './user-challenge.controller';
import { AdminChallengeController } from './admin-challenge.controller';
import { AdminChallengeService } from './admin-challenge.service';

@Module({
  providers: [UserChallengeService, AdminChallengeService],
  controllers: [UserChallengeController, AdminChallengeController],
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
