import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { IsPublic } from 'src/decorators/auth/isPublic.decorator';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';
import { AuthRequest } from 'src/interfaces/AuthRequest.interface';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Request() req: AuthRequest) {
        return this.authService.login(req.user)
    }
}