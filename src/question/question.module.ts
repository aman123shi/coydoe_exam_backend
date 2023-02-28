import { forwardRef, Module } from '@nestjs/common';
import { DirectionController } from '@app/question/direction.controller';
import { DirectionService } from '@app/question/direction.service';
import { GroupedQuestionController } from '@app/question/groupedQuestion.controller';
import { GroupedQuestionService } from '@app/question/groupedQuestion.service';
import { QuestionController } from '@app/question/question.controller';
import { QuestionService } from '@app/question/question.service';
import { CourseModule } from '@app/course/course.module';
import { ProgressModule } from '@app/progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import {
  GroupedQuestion,
  GroupedQuestionSchema,
} from './schemas/groupedQuestion.schema';
import { Direction, DirectionSchema } from './schemas/direction.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DataClerkModule } from '@app/dataClerk/dataClerk.module';
import { AdminModule } from '@app/admin/admin.module';

@Module({
  controllers: [
    QuestionController,
    DirectionController,
    GroupedQuestionController,
  ],
  providers: [QuestionService, DirectionService, GroupedQuestionService],
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: GroupedQuestion.name, schema: GroupedQuestionSchema },
      { name: Direction.name, schema: DirectionSchema },
    ]),
    CourseModule,
    forwardRef(() => ProgressModule),
    forwardRef(() => DataClerkModule),
    AdminModule,
    MulterModule.register({
      //  dest: '../../public/images/users',
      storage: diskStorage({
        destination: function (req, file, callback) {
          callback(null, 'public/images/questions/');
        },
        filename: (_req, file, callback) => {
          const ext = extname(file.originalname);
          let fileName = `${file.originalname}-${Date.now()}-${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  ],
  exports: [QuestionService, GroupedQuestionService],
})
export class QuestionModule {}
