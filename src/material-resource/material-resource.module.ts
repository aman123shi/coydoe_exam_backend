import { Module } from '@nestjs/common';
import { MaterialResourceController } from './material-resource.controller';
import { MaterialResourceService } from './material-resource.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterialResource,
  MaterialResourceSchema,
} from './schemas/material-resource.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DataClerkModule } from '@app/dataClerk/dataClerk.module';
import { AdminModule } from '@app/admin/admin.module';

@Module({
  controllers: [MaterialResourceController],
  providers: [MaterialResourceService],
  imports: [
    MongooseModule.forFeature([
      { name: MaterialResource.name, schema: MaterialResourceSchema },
    ]),

    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, callback) {
          callback(null, 'public/material-resources/');
        },
        filename: (_req, file, callback) => {
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${Date.now()}-${ext}`;
          callback(null, fileName);
        },
      }),
    }),
    DataClerkModule,
    AdminModule,
  ],
  exports: [MaterialResourceService],
})
export class MaterialResourceModule {}
