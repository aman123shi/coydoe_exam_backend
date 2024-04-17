import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Innovation, InnovationSchema } from './schema/innovation.schema';
import { InnovationController } from './innovation.controller';
import { InnovationService } from './innovation.service';

@Module({
  controllers: [InnovationController],
  providers: [InnovationService],
  imports: [
    MongooseModule.forFeature([
      { name: Innovation.name, schema: InnovationSchema },
    ]),
  ],
})
export class InnovationModule {}
