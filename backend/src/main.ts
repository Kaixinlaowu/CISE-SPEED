import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 移除没有装饰器的属性
      forbidNonWhitelisted: true, // 抛出错误如果有非白名单属性
      transform: true, // 自动转换类型
    }),
  );
  // 开启 CORS
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
