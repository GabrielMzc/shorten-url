import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from 'src/interfaces/AuthRequest.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue({ access_token: 'mocked_jwt_token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const req: AuthRequest = { user: { user_id: '123', email: 'test@example.com' } } as unknown as AuthRequest;
      const result = authController.login(req);
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });
  });
});
