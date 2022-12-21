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
@Module({
  imports: [
    QuestionModule,
    CourseModule,
    ExamCategoryModule,
    SubExamCategoryModule,
    AdminModule,
    UserModule,
    ProgressModule,
    MongooseModule.forRoot('mongodb://localhost/coydoe_exam_mongodb'),
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
        { path: 'submit-answer', method: RequestMethod.POST },
        { path: 'get-progress', method: RequestMethod.POST },
      );
  }
}
