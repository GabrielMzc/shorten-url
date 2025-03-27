import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as moment from 'moment';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    const isPublicRoute = request.route?.path === '/portalux-nest-apis/docs';
    if (isPublicRoute) {
      return true;
    }

    if (!authorization) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Token não informado, falha na autenticação!',
      });
    }

    const [, token] = authorization.split(' ');

    try {
      if (!process.env.JWT_KEY) {
        throw new UnauthorizedException('Chave JWT não configurada.');
      }

      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_KEY,
      });
      request['jwtToken'] = decodedToken.sub;
      return true;
    } catch (error) {
      this.handleJwtError(error);
      return false
    } 
  }

  private handleJwtError(error: any): void {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        status: 401,
        message: `O tempo de vida de seu token expirou, venceu em ${moment(error.expiredAt).format('DD/MM/YYYY HH:mm')}`,
      });
    } else if (error.name === 'JsonWebTokenError') {
      this.handleJsonWebTokenError(error);
    } else {
      throw new UnauthorizedException({
        status: 401,
        message: 'Falha ao gerar seu token, jwt não está ativo.',
      });
    }
  }

  private handleJsonWebTokenError(error: any): void {
    const errorMessages = {
      'jwt malformed': 'Falha ao gerar seu token (malformed)',
      'jwt signature is required':
        'Falha ao gerar seu token, assinatura é obrigatória.',
      'invalid signature': 'Falha ao gerar seu token, assinatura inválida.',
    };

    const message =
      errorMessages[error.message] ||
      `Falha ao gerar seu token, ${error.message}`;

    throw new UnauthorizedException({
      status: 401,
      message,
    });
  }
}
