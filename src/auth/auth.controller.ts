import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AuthenticatedUserGuard } from './guards/authenticated-user.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthLoginDto) {
    return await this.authService.login(user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log(req.cookies);
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, {
      httpOnly: true,
    });

    res.redirect('http://localhost:3000/auth/teste');
    return await this.authService.googleLogin(req.user);
  }
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userEmail = req.user['email'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userEmail, refreshToken);
  }

  @UseGuards(AuthenticatedUserGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const userEmail = req.user['email'];

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    await this.authService.logout(userEmail, refreshToken);

    res.end();
  }
}
