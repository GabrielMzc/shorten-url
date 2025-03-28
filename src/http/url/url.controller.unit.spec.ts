import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { NotFoundException, HttpStatus } from '@nestjs/common';

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: jest.Mocked<UrlService>;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    getUrls: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
    getUrlByShortCode: jest.fn(),
    redirectUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get(UrlService);
  });

  it('should be defined', () => {
    expect(urlController).toBeDefined();
  });

  describe('shortenUrlCreate', () => {
    it('should return a shortened URL', async () => {
      const data = { originalUrl: 'http://example.com' };
      const user = { id: 1 };
      const baseUrl = 'http://localhost';
      const shortUrl = 'abc123';

      urlService.shortenUrl.mockResolvedValue(shortUrl);

      const result = await urlController.shortenUrlCreate(data, user, baseUrl);

      expect(result).toEqual({ shortUrl });
      expect(urlService.shortenUrl).toHaveBeenCalledWith(data, user.id, baseUrl);
    });
  });

  describe('getAllUrls', () => {
    it('should return all URLs for a user', async () => {
      const user = { id: 1 };
      const urls = [
        {
          url_id: 1,
          short_url: 'http://localhost/abc123',
          original_url: 'http://example.com',
          clicks: 0,
          created_at: new Date(),
          updated_at: new Date(),
          accessLogs: [],
        },
      ];
  
      urlService.getUrls.mockResolvedValue(urls);
  
      const result = await urlController.getAllUrls(user);
  
      expect(result).toEqual(urls);
      expect(urlService.getUrls).toHaveBeenCalledWith(user.id);
    });
  });

  describe('updateUrl', () => {
    it('should update a URL and return a success message', async () => {
      const data = { shortUrl: 'abc123', originalUrl: 'http://example.com' };
      const baseUrl = 'http://localhost';

      const result = await urlController.updateUrl(data, baseUrl);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'URL successfully updated',
      });
      expect(urlService.updateUrl).toHaveBeenCalledWith(data, baseUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a URL and return a success message', async () => {
      const shortUrl = 'abc123';
      const baseUrl = 'http://localhost';
      const url = {
        url_id: 1,
        short_url: 'abc123',
        original_url: 'http://example.com',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        accessLogs: [],
      };
  
      urlService.getUrlByShortCode.mockResolvedValue(url);
  
      const result = await urlController.deleteUrl(shortUrl, baseUrl);
  
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'URL successfully deleted',
      });
      expect(urlService.getUrlByShortCode).toHaveBeenCalledWith(shortUrl, baseUrl);
      expect(urlService.deleteUrl).toHaveBeenCalledWith(shortUrl, baseUrl);
    });
  
    it('should throw a NotFoundException if the URL does not exist', async () => {
      const shortUrl = 'nonexistent';
      const baseUrl = 'http://localhost';
  
      urlService.getUrlByShortCode.mockResolvedValue(null);
  
      await expect(urlController.deleteUrl(shortUrl, baseUrl)).rejects.toThrow(
        new NotFoundException('URL not found or has already been deleted'),
      );
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortUrl = 'abc123';
      const req = { headers: { 'user-agent': 'Mozilla/5.0' }, ip: '127.0.0.1' };
      const baseUrl = 'http://localhost';
      const originalUrl = 'http://example.com';

      urlService.redirectUrl.mockResolvedValue(originalUrl);

      const result = await urlController.redirectToOriginalUrl(shortUrl, req, baseUrl);

      expect(result).toEqual({
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        originalUrl,
        message: 'Redirecting...',
      });
      expect(urlService.redirectUrl).toHaveBeenCalledWith(
        shortUrl,
        'Mozilla/5.0',
        '127.0.0.1',
        baseUrl,
      );
    });

    it('should return a 404 error if the URL is not found', async () => {
      const shortUrl = 'nonexistent';
      const req = { headers: { 'user-agent': 'Mozilla/5.0' }, ip: '127.0.0.1' };
      const baseUrl = 'http://localhost';

      urlService.redirectUrl.mockRejectedValue(new Error('URL not found'));

      const result = await urlController.redirectToOriginalUrl(shortUrl, req, baseUrl);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found or has already been deleted',
      });
    });
  });
});