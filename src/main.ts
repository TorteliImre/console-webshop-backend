import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { maxRequestBodySize } from './limits';
import { AdminOnly } from './admin/admin.guard';
import { AdminGuard } from './admin/admin.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('/api');
  app.use(json({ limit: maxRequestBodySize }));
  app.use(urlencoded({ limit: maxRequestBodySize, extended: true }));
  app.enableCors();

  configureSwagger(app);

  await app.listen(3000);
}
bootstrap();

function configureSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Console Webshop Backend')
    .setDescription('Console Webshop Backend')
    .setVersion('1.0')
    .addTag('users', 'Create users, find users and modify their data.')
    .addTag('authentication', 'Log into a user account.')
    .addTag('filters', 'Query values that can be used to filter adverts.')
    .addTag('adverts', 'Create, find and modify advertisements.')
    .addTag(
      'advert pictures',
      'Add pictures to advertisements, modify them and set primary.',
    )
    .addTag(
      'advert comments',
      'Post comments on advertisements and reply to them.',
    )
    .addTag('bookmarks', 'Bookmark advertisements for later viewing.')
    .addTag('cart', 'Put advertised items to cart to buy them.')
    .addTag(
      'suggestions',
      'Suggest new features and modifications to site owners.',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      defaultModelRendering: 'model',
    },
    // Hack to expand the schemas at the bottom
    customJsStr:
      'const onLoad = window.onload; window.onload = () => {onLoad(); setTimeout(() => {document.querySelectorAll("#swagger-ui section.models button.model-box-control").forEach(btn => btn.click());}, 100)}',
  });
}
