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
import { BaseUrl } from 'src/decorators/baseUrl.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrlCreate(
    @Body() data: ShortenUrlDto,
    @CurrentUser() user: any,
    @BaseUrl() baseUrl: string,
  ) {
    const shortUrl = await this.urlService.shortenUrl(data, user.id, baseUrl);

    return {
      shortUrl: shortUrl,
    };
  }

  @Get()
  getAllUrls(@CurrentUser() user: any) {
    return this.urlService.getUrls(user.id);
  }

  @Put()
  async updateUrl(@Body() data: UpdateUrlDto, @BaseUrl() baseUrl: string) {
    await this.urlService.updateUrl(data, baseUrl);
    return {
      statusCode: HttpStatus.OK,
      message: 'URL successfully updated',
    };
  }

  @Delete(':shortUrl')
  async deleteUrl(
    @Param('shortUrl') shortUrl: string,
    @BaseUrl() baseUrl: string,
  ) {
    const url = await this.urlService.getUrlByShortCode(shortUrl, baseUrl);
    if (!url) {
      throw new NotFoundException('URL not found or has already been deleted');
    }

    await this.urlService.deleteUrl(shortUrl, baseUrl);
    return {
      statusCode: HttpStatus.OK,
      message: 'URL successfully deleted',
    };
  }

  @Get('redirect/:shortUrl')
  async redirectToOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req: any,
    @BaseUrl() baseUrl: string,
  ) {
    try {
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress || '0.0.0.0';

      const originalUrl = await this.urlService.redirectUrl(
        shortUrl,
        userAgent,
        ipAddress,
        baseUrl,
      );
      return {
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        originalUrl: originalUrl,
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
