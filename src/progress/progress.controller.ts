import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { GetProgressDto } from './dto/getProgress.dto';
import { SubmitAnswerDto } from './dto/submitAnswer.dto';
import { ProgressService } from './progress.service';

@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}
  @Post('submit-answer')
  async submitAnswer(
    @Body() submitAnswerDto: SubmitAnswerDto,
    @Req() request: ExpressRequest,
  ) {
    return await this.progressService.submitAnswer(
      request.userId,
      submitAnswerDto,
    );
  }

  @Post('get-progress')
  async getProgress(
    @Body() getProgressDto: GetProgressDto,
    @Req() request: ExpressRequest,
  ) {
    return await this.progressService.getProgress(
      request.userId,
      getProgressDto,
    );
  }
}
