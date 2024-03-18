/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;
    if (user.role === 'USER') return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const signedJWT = this.jwtService.sign(payload);
    const decodedJwtAccessToken = this.jwtService.decode(signedJWT);
    const expires = decodedJwtAccessToken['exp'];
    return {
      access_token: signedJWT,
      expire: expires,
    };
  }
}
