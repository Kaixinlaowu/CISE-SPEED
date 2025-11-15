import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ArticleModule } from './articles/article.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/speed'),
    UserModule,
    ArticleModule,
  ],
})
export class AppModule {}
