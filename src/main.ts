import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: process.env.ENV == "prod" ? ['log', 'error', 'warn'] : ['error', 'warn', 'log', 'debug', 'verbose']
  });
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.ENV != "prod") {
    const config = new DocumentBuilder()
      .setTitle('Flightbook')
      .setDescription('The flightbbok api')
      .setVersion('1.0')
      .addBearerAuth(
        { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header'
        },
        'jwt',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(8282);
}
bootstrap();
