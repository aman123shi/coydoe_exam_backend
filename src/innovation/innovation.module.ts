import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Innovation, InnovationSchema } from './schema/innovation.schema';
import { InnovationController } from './innovation.controller';
import { InnovationService } from './innovation.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [InnovationController],
  providers: [InnovationService],
  imports: [
    MongooseModule.forFeature([
      { name: Innovation.name, schema: InnovationSchema },
    ]),

    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, callback) {
          callback(null, 'public/innovations/');
        },
        filename: (_req, file, callback) => {
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${Date.now()}-${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  ],
})
export class InnovationModule {}
