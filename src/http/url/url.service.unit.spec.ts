import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entities/Url.entity';
import { AccessLogEntity } from 'src/entities/AccessLog.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { IsNull } from 'typeorm';

describe('UrlService', () => {
  let urlService: UrlService;
  let urlRepository: jest.Mocked<Repository<UrlEntity>>;
  let accessLogRepository: jest.Mocked<Repository<AccessLogEntity>>;
  let userService: jest.Mocked<UserService>;

  const mockUrlRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  const mockAccessLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(UrlEntity),
          useValue: mockUrlRepository,
        },
        {
          provide: getRepositoryToken(AccessLogEntity),
          useValue: mockAccessLogRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlRepository = module.get(getRepositoryToken(UrlEntity));
    accessLogRepository = module.get(getRepositoryToken(AccessLogEntity));
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('getUrls', () => {
    it('should return all URLs for a user', async () => {
      const userId = 1;
      const urls = [
        {
          short_url: 'http://localhost/abc123',
          original_url: 'http://example.com',
          clicks: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
  
      mockUrlRepository.find.mockResolvedValue(urls);
  
      const result = await urlService.getUrls(userId);
  
      expect(result).toEqual(urls);
      expect(mockUrlRepository.find).toHaveBeenCalledWith({
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
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('redirectUrl', () => {
    it('should redirect the URL correctly', async () => {
      const shortUrl = 'abc123';
      const userAgent = 'Mozilla/5.0';
      const ipAddress = '127.0.0.1';
      const baseUrl = 'http://localhost';
  
      const url = { original_url: 'http://example.com', url_id: 1 };
  
      mockUrlRepository.findOne.mockResolvedValue(url);
      mockAccessLogRepository.create.mockReturnValue({
        url: { url_id: 1 },
        user_agent: userAgent,
        ip_address: ipAddress,
      });
      mockAccessLogRepository.save.mockResolvedValue(undefined);
  
      const result = await urlService.redirectUrl(shortUrl, userAgent, ipAddress, baseUrl);
  
      expect(result).toBe(url.original_url);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: {
          short_url: `${baseUrl}/${shortUrl}`,
          deleted_at: IsNull(),
        },
      });
      expect(mockAccessLogRepository.create).toHaveBeenCalledWith({
        url: { url_id: 1 },
        user_agent: userAgent,
        ip_address: ipAddress,
      });
      expect(mockAccessLogRepository.save).toHaveBeenCalled();
    });
  });
});