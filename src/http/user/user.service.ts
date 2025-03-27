import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {hash} from 'bcryptjs';
import { UserEntity } from 'src/entities/User.entity';
import { CreateUserDto } from 'src/models/User.model';

@Injectable()
export class UserService {

  constructor( 
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {

    const encripitedHash: string = await hash(createUserDto.password, 10);

    const createQuery: UserEntity = this.repository.create({
      ...createUserDto,
      password_hash: encripitedHash,
    });

    const save: UserEntity = await this.repository.save(createQuery);

    return { ...save, password_hash: undefined};
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findOneBy({ email: email });
    return user;
  }

  async findById(userId: number): Promise<UserEntity | null> {
    return this.repository.findOneBy({ user_id: userId });
  }
  
}