import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RequestTimeLogsInterceptor } from './interceptors/requestTimeLogs.interceptor';
import { SwaggerApiModule } from './documentation/swagger.module';
import { HttpExceptionFilter } from './common/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  SwaggerApiModule.setupSwagger(app);

  app.useGlobalInterceptors(new RequestTimeLogsInterceptor());

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on the port ${process.env.PORT}`)
}
bootstrap();
