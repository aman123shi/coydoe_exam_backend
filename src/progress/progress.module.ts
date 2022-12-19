import { QuestionModule } from '@app/question/question.module';
import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './page.entity';
import { PagesService } from './pages.service';
import { ProgressEntity } from './progress.entity';
import { ProgressService } from './progress.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity, ProgressEntity]),

    forwardRef(() => QuestionModule),
  ],
  providers: [PagesService, ProgressService],
  exports: [PagesService, ProgressService],
})
export class ProgressModule {}
