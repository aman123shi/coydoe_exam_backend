import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import mongoose from 'mongoose';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/createCountry.dto';
import { UpdateCountryDto } from './dto/updateCountry.dto';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getCountries() {
    return await this.countryService.getCountries();
  }

  @Post()
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    return await this.countryService.createCountry(createCountryDto);
  }

  @Post('/:id')
  async updateCountry(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updateCountry: UpdateCountryDto,
  ) {
    return await this.countryService.updateCountry(id, updateCountry);
  }
}
