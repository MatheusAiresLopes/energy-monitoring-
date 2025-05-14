import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração global de validação
  app.useGlobalPipes(new ValidationPipe());

  // Configuração do motor de templates Handlebars
  app.setViewEngine('hbs');
  
  // Configuração correta do caminho para as views
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));  // A pasta views está no nível superior ao src

  await app.listen(3000);
}
bootstrap();
