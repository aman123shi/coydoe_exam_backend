import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetChallengeDto {
  @IsNotEmpty()
  @IsMongoId()
  challengeId: string;
}
