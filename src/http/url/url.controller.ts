import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto, UpdateUrlDto } from 'src/models/Url.model';
import { CurrentUser } from 'src/decorators/auth/currentUser.decorator';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  shortenUrlCreate(@Body() data: ShortenUrlDto, @CurrentUser() user: any) {
    console.log(user);
    return this.urlService.shortenUrl(data, user.id);
  }

  @Get()
  getAllUrls(@CurrentUser() user: any) {
    return this.urlService.getUserUrls(user.id);
  }

  @Put()
  async updateUrl(@Body() data: UpdateUrlDto) {
    const updatedUrl = await this.urlService.updateUrl(data);
    return updatedUrl;
  }

  @Delete(':shortUrl')
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlService.getUrlByShortCode(shortUrl);
    if (!url) {
      throw new NotFoundException('URL not found or has already been deleted');
    }

    await this.urlService.deleteUrl(shortUrl);
    return {
      statusCode: HttpStatus.OK,
      message: 'URL successfully deleted',
    };
  }

  @Get('redirect/:shortUrl')
  async redirectToOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req: any,
  ) {
    try {
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';

      await this.urlService.redirectUrl(shortUrl, userAgent, ipAddress);
      return {
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        message: 'Redirecting...',
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found or has already been deleted',
      };
    }
  }
}
