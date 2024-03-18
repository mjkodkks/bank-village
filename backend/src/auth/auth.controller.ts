import { Controller, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { User } from '@prisma/client';

type MergeTypes<A, B> = {
  [key in keyof A]: key extends keyof B ? B[key] : A[key];
} & B;
export interface loginRequest { 
  user: User;
}
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login (ล๊อกอิน)' })
  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
      type: 'object',
    },
  })
  async login(@Req() req: MergeTypes<Request, loginRequest>) {
    return this.authService.login(req.user);
  }
}
