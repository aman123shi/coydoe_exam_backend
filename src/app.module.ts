import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DBconfig } from '@app/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './question/question.module';
import { CourseModule } from './course/course.module';
import { ExamCategoryModule } from './exam-category/exam-category.module';
import { SubExamCategoryModule } from './sub-exam-category/sub-exam-category.module';
import { AdminModule } from './admin/admin.module';
import { UnprocessableEntityExceptionFilter } from './exception-handlers/unprocessableEntity-exception.filter';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DBconfig),
    QuestionModule,
    CourseModule,
    ExamCategoryModule,
    SubExamCategoryModule,
    AdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, UnprocessableEntityExceptionFilter],
})
export class AppModule {}
