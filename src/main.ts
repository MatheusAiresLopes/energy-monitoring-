import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as hbs from 'hbs';  // Importa o handlebars

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração global de validação com transformação automática dos tipos
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,              // Remove propriedades não declaradas nos DTOs
    forbidNonWhitelisted: true,   // Retorna erro se houver propriedades extras
  }));

  // Configura diretórios das views e do motor de template
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Configura a pasta de arquivos estáticos (css, js, imagens etc)
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  // Registra os partials do Handlebars (componentes reutilizáveis)
  hbs.registerPartials(path.join(__dirname, '..', 'views/partials'));

  // Caso queira ativar CORS (descomente se precisar)
  // app.enableCors();

  // Inicia a aplicação
  await app.listen(3000);

  console.log('Servidor rodando em http://localhost:3000');
}
bootstrap();
