import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BaseUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    return baseUrl;
  },
);
