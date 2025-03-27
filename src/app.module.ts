import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './http/user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UrlModule } from './http/url/url.module';
import { HttpExceptionFilter } from './common/httpException.filter';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, UrlModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
