import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { UserService } from '../http/user/user.service';
import { UserEntity } from 'src/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
) {}

  login(user: UserEntity) {

    const payload = {
      sub: user.user_id,
      username: user.email,
    };

    const jwtToken = this.jwtService.sign(payload)

    return {
        access_token: jwtToken
    }

  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUserName(username);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password_hash!);

      if (isPasswordValid) {
        return {
          ...user,
          password_hash: undefined,
        };
      }
    }

    throw new Error('Email address or password provided is incorrect.');
  }
}