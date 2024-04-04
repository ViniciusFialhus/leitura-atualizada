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
    private httpSevice: HttpService,
  ) {
    super();
  }

  async validate(@Req() req: Request) {
    const userToken = req.headers.authorization;
    const googleToken = req.cookies['access_token'];

    if (googleToken) {
      const config = { headers: { Authorization: `Bearer ${googleToken}` } };
      const userData = await this.httpSevice.axiosRef.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        config,
      );
      const userFound = await this.usersService.findByEmail(
        userData.data.email,
      );
      if (userFound.isAdm) return true;
    } else if (userToken) {
      const tokenData = await this.authService.decryptToken(userToken);
      const userFound = await this.usersService.findByEmail(tokenData.email);
      if (userFound.isAdm) return true;
    }
    return false;
  }
}
