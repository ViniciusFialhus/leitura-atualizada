import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ErrorSwagger } from '../helpers/swagger/ErrorSwagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AdminAccessGuard } from './guards/admin.guard';
import { AuthenticatedUserGuard } from './guards/authenticated-user.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { ResponseLogin } from './swagger/ResponseLogin';
import { ResponsePromote } from './swagger/ResponsePromote';
import { Cookies } from './utils/cookies.decorator';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: "Efetua login de um usuário no sistema" })
  @ApiResponse({ status: 200, description: "Operação bem sucedida", type: ResponseLogin })
  @ApiResponse({ status: 400, description: "senha ou email incorreto.", type: ErrorSwagger })
  @ApiBody({ type: AuthLoginDto, description: "Dados do usuário" })
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthLoginDto) {
    return await this.authService.login(user);
  }
  
  @Post('google')
  @ApiOperation({ summary: "Efetua login de um usuário com google", })
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @Post('google/callback')
  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rota que complementa o fluxo de login com google" })
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

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Atualiza os tokens do usuário logado no sistema' })
  @ApiResponse({ status: 200, description: "Operação bem sucedida", type: ResponseLogin })
  @ApiResponse({ status: 403, description: "Sem permissão", type: ErrorSwagger })
  refreshTokens(@Req() req: Request) {
    const userEmail = req.user['email'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshAccess(userEmail, refreshToken);
  }

  @Patch('promote/:email')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @ApiOperation({ summary: "Efetua login para admins no sistema" })
  @ApiResponse({ status: 200, description: "Operação bem sucedida", type: ResponsePromote })
  @ApiParam({ name: "email", description: "email do usuário" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado", type: ErrorSwagger })
  @HttpCode(HttpStatus.NO_CONTENT)
  promote(@Param('email') userEmail: string) {
    return this.authService.promoteUser(userEmail);
  }

  @Post('logout')
  @UseGuards(AuthenticatedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Efetua logout da sessão atual do usuário logado" })
  @ApiResponse({ status: 200, description: "Operação bem sucedida" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado", type: ErrorSwagger })
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
