import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectionDto } from './createDirection.dto';

export class UpdateDirectionDto extends PartialType(CreateDirectionDto) {}
