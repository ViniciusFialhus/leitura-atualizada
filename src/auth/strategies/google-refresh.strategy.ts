import { Injectable, Req, Res } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleRefreshStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];

    if (
      accessToken &&
      refreshToken &&
      !(await this.authService.isTokenExpired(accessToken))
    ) {
      return true;
    } else if (
      accessToken &&
      refreshToken &&
      (await this.authService.isTokenExpired(accessToken))
    ) {
      try {
        const newAccessToken =
          await this.authService.refreshGoogleToken(refreshToken);
        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
        });

        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }
}
