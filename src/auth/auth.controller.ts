import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { IsPublic } from 'src/decorators/auth/isPublic.decorator';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';
import { AuthRequest } from 'src/interfaces/AuthRequest.interface';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/models/User.model';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login using email and password' })
    @ApiBody({
      description: 'User credentials',
      type: CreateUserDto, 
    })
    login(@Request() req: AuthRequest) {
        return this.authService.login(req.user)
    }
}