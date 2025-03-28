import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../http/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserEntity } from '@entity/User.entity';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_jwt_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', () => {
      const user: UserEntity = { 
        user_id: 123, 
        email: 'test@example.com', 
        created_at: new Date(), 
        updated_at: new Date(), 
        urls: [] 
      } as UserEntity;
      const result = authService.login(user);
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 123, email: 'test@example.com' });
    });
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const user: UserEntity = {
        user_id: 123,
        email: 'test@example.com',
        password_hash: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
        urls: [],
      } as UserEntity;

      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');

      expect(result).toEqual({ ...user, password_hash: undefined });
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(compare).toHaveBeenCalledWith('password', 'hashed_password');
    });

    it('should throw an error if credentials are invalid', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.validateUser('wrong@example.com', 'password'))
        .rejects.toThrow('Email address or password provided is incorrect.');
    });
  });
});
