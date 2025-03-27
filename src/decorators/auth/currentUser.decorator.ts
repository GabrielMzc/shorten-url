import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from 'src/entities/User.entity';
import { AuthRequest } from 'src/interfaces/AuthRequest.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);