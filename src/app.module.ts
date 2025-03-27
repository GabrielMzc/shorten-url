import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './http/user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
