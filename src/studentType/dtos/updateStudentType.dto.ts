import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentTypeDTO } from './createStudentType.dto';

export class UpdateStudentTypeDto extends PartialType(CreateStudentTypeDTO) {}
