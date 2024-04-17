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

import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';
import { CountryModule } from './country/country.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { UserPointsCleanupService } from './leaderboard/userPointsClean.scheduled';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StudentTypeModule } from './studentType/studentType.module';
import { ExerciseModule } from './exercise/exercise.module';
import { GeneralQuestionModule } from './general-question/generalQuestion.module';

import { MailingModule } from './mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MaterialResourceModule } from './material-resource/material-resource.module';
import { AdminChallengeModule } from './admin-challenge/admin-challenge.module';
import { InnovationModule } from './innovation/innovation.module';

@Module({
  imports: [
    MailingModule,
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    StudentTypeModule,
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
    ExerciseModule,
    GeneralQuestionModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    AdminChallengeModule,
    MaterialResourceModule,
    InnovationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UnprocessableEntityExceptionFilter],
})
export class AppModule implements NestModule, OnModuleInit {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(
      { path: 'questions/create', method: RequestMethod.POST },
      { path: 'data-clerk', method: RequestMethod.GET },
      { path: 'grouped-questions/create', method: RequestMethod.POST },
      { path: 'submit-answer', method: RequestMethod.POST },
      { path: 'get-progress', method: RequestMethod.POST },
      { path: 'create-challenge', method: RequestMethod.POST },
      { path: 'submit-challenge', method: RequestMethod.POST },
      { path: 'submit-additional-questions', method: RequestMethod.POST },
      { path: 'get-additional-questions', method: RequestMethod.POST },
      { path: 'notifications', method: RequestMethod.GET },
      { path: 'notifications/get-new-count', method: RequestMethod.GET },
      { path: 'users/all', method: RequestMethod.GET },
      { path: 'users/update-user-info', method: RequestMethod.PUT },
      { path: 'users/get-reward-point', method: RequestMethod.GET }, //
      { path: 'get-challenge-invitation', method: RequestMethod.GET },
      { path: 'get-my-challenge', method: RequestMethod.GET },
      { path: 'general-questions', method: RequestMethod.POST },
      { path: 'users/upload-payment-image', method: RequestMethod.POST },
      { path: 'users/change-password', method: RequestMethod.POST },
      { path: 'users/is-premium-active', method: RequestMethod.GET },
      { path: 'leaderboard/daily', method: RequestMethod.GET },
      { path: 'leaderboard/weekly', method: RequestMethod.GET },
      { path: 'leaderboard/monthly', method: RequestMethod.GET },
      { path: 'material-resources', method: RequestMethod.POST },
      { path: 'user-challenge/create', method: RequestMethod.POST },
      { path: 'user-challenge/submit', method: RequestMethod.PUT },
    );
  }
  constructor(private usersPointCleanUp: UserPointsCleanupService) {}
  onModuleInit() {
    this.usersPointCleanUp.dropAndInitLeaderBoard();
    console.log(
      'drop and init leader board called -----------------------------',
    );
    console.log(process.env.MONGO_DB_URI);
  }
}
