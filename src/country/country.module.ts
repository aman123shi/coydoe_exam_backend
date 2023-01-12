import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country, CountrySchema } from './schemas/country.schema';

@Global()
@Module({
  providers: [CountryService],
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  exports: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
