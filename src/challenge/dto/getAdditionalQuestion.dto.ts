import { IsNotEmpty } from 'class-validator';

export class GetAdditionalQuestionDto {
  @IsNotEmpty()
  challengeId: string;
}
