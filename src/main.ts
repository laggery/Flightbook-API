import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VERSION_NEUTRAL, ValidationPipe, VersioningType, LogLevel } from '@nestjs/common';
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Map the log levels from environment variables to LogLevel enum values
  const logLevels = process.env.LOG_LEVELS?.split(',').filter(level => 
    ['log', 'error', 'warn', 'debug', 'verbose'].includes(level)
  ) as LogLevel[] || ['error', 'warn', 'log'] as LogLevel[];
  
  const app = await NestFactory.create(AppModule,{
    logger: logLevels,
    rawBody: true
  });
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL
  })

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
