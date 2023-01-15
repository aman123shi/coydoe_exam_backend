import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
@Module({
  imports: [
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
    MongooseModule.forRoot(mongoDB_URI),
  ],
  controllers: [AppController],
  providers: [AppService, UnprocessableEntityExceptionFilter],
})
export class AppModule implements NestModule {
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
        { path: 'notifications', method: RequestMethod.GET },
      );
  }
}
