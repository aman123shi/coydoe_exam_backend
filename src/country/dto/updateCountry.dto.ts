import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './createCountry.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
