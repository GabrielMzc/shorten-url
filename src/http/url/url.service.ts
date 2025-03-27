import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entities/Url.entity';
import { ShortenUrlDto, UpdateUrlDto } from 'src/models/Url.model';
import { nanoid } from 'nanoid';
import { UserService } from '../user/user.service';
import { AccessLogEntity } from 'src/entities/AccessLog.entity';

@Injectable()
export class UrlService {

  constructor( 
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    private readonly userService: UserService,
    @InjectRepository(AccessLogEntity)
    private readonly accessLogRepository: Repository<AccessLogEntity>,
  ) {}
  
  async shortenUrl(data: ShortenUrlDto, userId: number): Promise<string> {
    const shortenedUrl = nanoid(6);
    const user = userId ? await this.userService.findById(userId) : null;

    const url = this.repository.create({
      original_url: data.originalUrl,
      short_url: shortenedUrl,
      user: user || undefined,
    });

    await this.repository.save(url);
    return shortenedUrl;
  }

  async getUserUrls(userId: number): Promise<UrlEntity[]> {
    return this.repository.find({
      where: {
        user: { user_id: userId },
        deleted_at: IsNull(),
      },
      select: {
        short_url: true,
        original_url: true,
        clicks: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getUrlByShortCode(shortUrl: string): Promise<UrlEntity | null> {
    return this.repository.findOne({
      where: {
        short_url: shortUrl,
        deleted_at: IsNull(),
      },
    });
  }

  async updateUrl(data: UpdateUrlDto): Promise<any> {
    return this.repository.update({
        short_url: data.shortUrl, deleted_at: IsNull(),
    },{
      original_url: data.originalUrl,
      updated_at: new Date(),
    });
  }

  async deleteUrl(shortUrl: string): Promise<any> {
    return this.repository.update({
        short_url: shortUrl, deleted_at: IsNull(),
    },{
        deleted_at: new Date(),
    });
  }

  async logUrlAccess(urlId: number, userAgent: string, ipAddress: string) {
    const log = this.accessLogRepository.create({
      url: { url_id: urlId },
      user_agent: userAgent,
      ip_address: ipAddress,
    });

    await this.accessLogRepository.save(log);

    await this.repository.update(urlId, {
      clicks: () => 'clicks + 1',
    });
  }

  async redirectUrl(shortUrl: string, userAgent: string, ipAddress: string): Promise<string> {
    const url = await this.getUrlByShortCode(shortUrl);
    if (!url) {
      throw new Error('URL not found');
    }

    await this.logUrlAccess(url.url_id, userAgent, ipAddress);

    return url.original_url;
  }
}
