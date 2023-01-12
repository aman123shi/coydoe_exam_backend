import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCountryDto } from './dto/createCountry.dto';
import { UpdateCountryDto } from './dto/updateCountry.dto';
import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async createCountry(createCountryDto: CreateCountryDto) {
    let newCountry = new this.countryModel();
    Object.assign(newCountry, createCountryDto);
    return await newCountry.save();
  }

  async getCountries() {
    return await this.countryModel.find();
  }
  async updateCountry(
    id: mongoose.Schema.Types.ObjectId,
    updateCountryDto: UpdateCountryDto,
  ) {
    return await this.countryModel.findByIdAndUpdate(id, updateCountryDto);
  }
}
