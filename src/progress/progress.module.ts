import { QuestionModule } from '@app/question/question.module';
import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { Page, PageSchema } from './schemas/page.schema';
import { Progress, ProgressSchema } from './schemas/progress.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Page.name, schema: PageSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
    forwardRef(() => QuestionModule),
  ],
  controllers: [ProgressController],
  providers: [PagesService, ProgressService],
  exports: [PagesService, ProgressService],
})
export class ProgressModule {}
