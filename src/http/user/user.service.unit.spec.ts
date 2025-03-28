import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { CreateUserDto } from 'src/models/User.model';
import { hash } from 'bcryptjs';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it without password_hash', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await hash(createUserDto.password, 10);
      const savedUser = {
        user_id: 1,
        email: createUserDto.email,
        password_hash: hashedPassword,
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser as UserEntity);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as UserEntity);

      const result = await userService.create(createUserDto);
      expect(result).toEqual({ user_id: 1, email: 'test@example.com', password_hash: undefined });
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user: UserEntity = { 
        user_id: 1, 
        email: 'test@example.com', 
        password_hash: 'hashedpass', 
        created_at: new Date(), 
        updated_at: new Date(), 
        urls: [] 
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await userService.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await userService.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user: UserEntity = { 
        user_id: 1, 
        email: 'test@example.com', 
        password_hash: 'hashedpass', 
        created_at: new Date(), 
        updated_at: new Date(), 
        urls: [] 
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await userService.findById(1);
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await userService.findById(99);
      expect(result).toBeNull();
    });
  });
});
