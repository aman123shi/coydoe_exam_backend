import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { QuestionModule } from './question/question.module';
import { CourseModule } from './course/course.module';
import { ExamCategoryModule } from './exam-category/exam-category.module';
import { SubExamCategoryModule } from './sub-exam-category/sub-exam-category.module';
import { AdminModule } from './admin/admin.module';
import { UnprocessableEntityExceptionFilter } from './exception-handlers/unprocessableEntity-exception.filter';
import { UserModule } from './user/user.module';
import { ProgressModule } from './progress/progress.module';
import { UserAuthMiddleware } from './user/middlewares/userAuth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDB_URI } from './config';
import { NotificationModule } from './notification/notification.module';
import { ChallengeModule } from './challenge/challenge.module';
import { CountryModule } from './country/country.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { UserPointsCleanupService } from './leaderboard/userPointsClean.scheduled';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    QuestionModule,
    CourseModule,
    ExamCategoryModule,
    SubExamCategoryModule,
    AdminModule,
    UserModule,
    ProgressModule,
    NotificationModule,
    ChallengeModule,
    CountryModule,
    LeaderBoardModule,
    AuthModule,
    MongooseModule.forRoot(mongoDB_URI),
  ],
  controllers: [AppController],
  providers: [AppService, UnprocessableEntityExceptionFilter],
})
export class AppModule implements NestModule, OnModuleInit {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.POST },
        { path: 'grouped-questions', method: RequestMethod.POST },
        { path: 'submit-answer', method: RequestMethod.POST },
        { path: 'get-progress', method: RequestMethod.POST },
        { path: 'create-challenge', method: RequestMethod.POST },
        { path: 'submit-challenge', method: RequestMethod.POST },
        { path: 'submit-additional-questions', method: RequestMethod.POST },
        { path: 'get-additional-questions', method: RequestMethod.POST },
        { path: 'notifications', method: RequestMethod.GET },
        { path: 'notifications/get-new-count', method: RequestMethod.GET },
        { path: 'users/all', method: RequestMethod.GET },
        { path: 'users/get-reward-point', method: RequestMethod.GET },
      );
  }
  constructor(private usersPointCleanUp: UserPointsCleanupService) {}
  onModuleInit() {
    this.usersPointCleanUp.dropAndInitLeaderBoard();
    console.log(
      'drop and init leader board called -----------------------------',
    );
  }
}
