import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlEntity } from 'src/entities/Url.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/entities/User.entity';
import { AccessLogEntity } from 'src/entities/AccessLog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity, UserEntity, AccessLogEntity]),
  ],
  controllers: [UrlController],
  providers: [UrlService, UserService],
})
export class UrlModule {}
