import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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

  const config = new DocumentBuilder()
    .setTitle('Console Webshop Backend')
    .setDescription('Console Webshop Backend')
    .setVersion('1.0')
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

  await app.listen(3000);
}
bootstrap();
