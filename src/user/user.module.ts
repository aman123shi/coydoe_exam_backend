import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthMiddleware } from './middlewares/userAuth.middleware';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthMiddleware],
  exports: [UserAuthMiddleware],
})
export class UserModule {}
