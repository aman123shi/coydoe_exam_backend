import { NotificationModule } from '@app/notification/notification.module';
import { QuestionModule } from '@app/question/question.module';
import { UserModule } from '@app/user/user.module';
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
    NotificationModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
})
export class ChallengeModule {}
