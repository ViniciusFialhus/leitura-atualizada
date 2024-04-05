import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
  Headers,
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
import { Cookies } from './utils/cookies.decorator';
import { AdminAccessGuard } from './guards/admin.guard';

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
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, {
      httpOnly: true,
    });

    await this.authService.googleLogin(req.user);
    return res.redirect('back');
  }
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userEmail = req.user['email'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshAccess(userEmail, refreshToken);
  }

  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @Patch('promote/:email')
  @HttpCode(HttpStatus.NO_CONTENT)
  promote(@Param('email') userEmail: string) {
    return this.authService.promoteUser(userEmail);
  }

  @UseGuards(AuthenticatedUserGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Cookies('refresh_token') refreshToken: string,
    @Headers('Authorization') userToken: string,
    @Res() res: Response,
  ) {
    const tokenData = await this.authService.decryptToken(userToken);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    this.authService.logout(tokenData.email, refreshToken);

    res.end();
  }
}
