import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { createChallengeParamsDto } from './dto/createChallengeParams.dto';
import { GetAdditionalQuestionDto } from './dto/getAdditionalQuestion.dto';
import { GetChallengeDto } from './dto/getChallange.dto';
import { SubmitAdditionalQuestionsDto } from './dto/submitAdditionalQuestion.dto';
import { SubmitChallengeDto } from './dto/submitChallenge.dto';

@Controller()
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}

  @Post('create-challenge')
  async createChallenge(
    @Body() createChallengeDto: createChallengeParamsDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.createChallenge({
      courseId: createChallengeDto.courseId,
      opponentId: createChallengeDto.opponentId,
      userId: req.userId,
    });
  }

  @Post('submit-challenge')
  async submitChallenge(
    @Body() submitChallengeDto: SubmitChallengeDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.submitChallenge({
      challengeId: submitChallengeDto.challengeId,
      questionsInfo: submitChallengeDto.questionsInfo,
      userId: req.userId,
    });
  }

  @Post('get-challenge-questions')
  async getChallengeQuestions(@Body() getChallengeDto: GetChallengeDto) {
    return await this.challengeService.getChallengeQuestions(
      getChallengeDto.challengeId,
    );
  }
  @Post('get-additional-questions')
  async getAdditionalChallengeQuestions(
    @Body() getAdditionalQuestionDto: GetAdditionalQuestionDto,
  ) {
    return await this.challengeService.getAdditionalQuestions(
      getAdditionalQuestionDto.challengeId,
    );
  }

  @Post('submit-additional-questions')
  async submitAdditionalQuestions(
    @Body() submitAdditionalQuestion: SubmitAdditionalQuestionsDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.submitAdditionalQuestions(
      submitAdditionalQuestion.challengeId,
      req.userId,
      submitAdditionalQuestion.questionsInfo,
    );
  }
}