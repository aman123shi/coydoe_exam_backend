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
import { UserModule } from '@app/user/user.module';
import {
  ChallengeWinners,
  ChallengeWinnersSchema,
} from './schemas/challenge-winners.schema';
import { NotificationModule } from '@app/notification/notification.module';
import { AdminChallengeCronService } from './adminChallengeCron.service';
import {
  FixedChallenges,
  FixedChallengesSchema,
} from './schemas/fixed-challenges.schema';

@Module({
  providers: [
    UserChallengeService,
    AdminChallengeService,
    AdminChallengeCronService,
  ],
  controllers: [UserChallengeController, AdminChallengeController],
  exports: [],
  imports: [
    MongooseModule.forFeature([
      { name: AdminChallenge.name, schema: AdminChallengeSchema },
      { name: UserChallenge.name, schema: UserChallengeSchema },
      { name: ChallengeWinners.name, schema: ChallengeWinnersSchema },
      { name: FixedChallenges.name, schema: FixedChallengesSchema },
    ]),
    QuestionModule,
    UserModule,
    NotificationModule,
  ],
})
export class AdminChallengeModule {}
