import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${config.get('db.host')}/${config.get('db.name')}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
