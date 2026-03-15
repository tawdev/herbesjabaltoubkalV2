import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
  // Serve the images folder as static assets from /images/...
  app.useStaticAssets(join(process.cwd(), '..', 'frontend', 'public', 'images'), {
    prefix: '/images/',
  });

  app.use((req: any, res: any, next: any) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
  });
  
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
