import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserAuthMiddleware } from './middlewares/userAuth.middleware';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({
      //  dest: '../../public/images/users',
      storage: diskStorage({
        destination: function (req, file, callback) {
          callback(null, 'public/images/users/');
        },
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          let fileName = `${file.originalname}-${Date.now()}-${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthMiddleware],
  exports: [UserAuthMiddleware, UserService],
})
export class UserModule {}
