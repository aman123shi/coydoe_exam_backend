import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  createdAt: string;

  @IsOptional()
  updatedAt: string;

  @IsOptional()
  socketId: string;

  @IsOptional()
  isOnline: boolean;

  @IsOptional() // rewardPoint
  __v: string;

  @IsOptional()
  rewardPoint: number;

  @IsOptional()
  paymentImageUrl: string;

  @IsOptional()
  _id: string;
}
