import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialResourceDto } from './createMaterialResource.dto';

export class UpdateMaterialResourceDto extends PartialType(
  CreateMaterialResourceDto,
) {}
