import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import UserSchema from './schemas/user.schema';
import { UserController } from './user.controller';
import { USER } from './const';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
