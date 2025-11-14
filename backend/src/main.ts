// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许前端 localhost:3000 跨域
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);

  console.log(`服务器运行在: http://localhost:${PORT}`);
  console.log(`MongoDB 连接中...`);
}

bootstrap().catch((err) => {
  console.error('启动失败:', err);
  process.exit(1);
});
