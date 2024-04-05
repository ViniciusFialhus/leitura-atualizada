import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AdminAccessStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(@Req() req: Request) {
    const userToken = req.headers.authorization;
    const googleToken = req.cookies['access_token'];

    if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      const userFound = await this.usersService.findByEmail(userEmail);
      if (userFound.isAdm) return true;
    } else if (userToken) {
      const tokenData = await this.authService.decryptToken(userToken);
      const userFound = await this.usersService.findByEmail(tokenData.email);
      if (userFound.isAdm) return true;
    }
    return false;
  }
}
