import { AuthModule } from './../auth/auth.module';
import { DynamicModule, Module } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APP_GUARD } from '@nestjs/core';
import { swaggerOptions } from './conf/swagger.conf';
import { RequestTimeLogsInterceptor } from 'src/interceptors/requestTimeLogs.interceptor';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UrlModule } from 'src/http/url/url.module';
import { UserModule } from 'src/http/user/user.module';
import { HttpExceptionFilter } from 'src/common/httpException.filter';
import { authConfig } from './conf/auth.conf';

@Module({})
export class SwaggerApiModule {
  static setupSwagger(app): DynamicModule {
    const appAuthCongif = new DocumentBuilder()
      .setTitle('Shoten URL APIs - Auth')
      .setDescription('Shoten URL APIs Documentation - Auth')
      .setVersion('1.0')
      .build();

    const appAuthDocument = SwaggerModule.createDocument(app, appAuthCongif, {
      include: [AuthModule, UserModule],
    });

    SwaggerModule.setup(
      'api/docs/auth',
      app,
      appAuthDocument,
      swaggerOptions,
    );

    const appUrlCongif = new DocumentBuilder()
      .setTitle('Shoten URL APIs - Url')
      .setDescription('Shoten URL APIs Documentation - Url')
      .setVersion('1.0')
      .addBearerAuth(authConfig, 'JWT-auth')
      .build();

    const appUrlDocument = SwaggerModule.createDocument(app, appUrlCongif, {
      include: [UrlModule],
    });

    SwaggerModule.setup(
      'api/docs/url',
      app,
      appUrlDocument,
      swaggerOptions,
    );

    return {
      module: SwaggerApiModule,
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: 'REQUEST_TIME_LOGS_INTERCEPTOR',
          useClass: RequestTimeLogsInterceptor,
        },
        {
          provide: 'HTTP_EXCEPTION_FILTER',
          useClass: HttpExceptionFilter,
        },
      ],
    };
  }
}
