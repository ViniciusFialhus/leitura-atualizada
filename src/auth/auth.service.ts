import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthGoogleDto } from './dtos/auth-google.dto';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthLogin as UserCredentials } from './entities/auth-login.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) { }

  async generateTokens(payload: AuthPayloadDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userEmail: string, refreshToken: string) {
    await this.usersService.updateUser(userEmail, { refreshToken });
  }

  async validateUser(
    userData: Partial<AuthLoginDto>,
  ): Promise<UserCredentials> {
    const user = await this.usersService.findByEmail(userData.email);

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Email ou senha incorretos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async login(userData: AuthLoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userFound = await this.validateUser(userData);

    const payload: AuthPayloadDto = {
      sub: userFound.id,
      email: userFound.email,
    };

    const tokens = await this.generateTokens(payload);
    await this.updateRefreshToken(userFound.email, tokens.refreshToken);
    return tokens;
  }

  async decryptToken(bearerToken: string): Promise<AuthPayloadDto> {
    const token = bearerToken.replace('Bearer', '').trim();
    const tokenData = this.jwtService.verifyAsync(token);

    return tokenData;
  }

  async promoteUser(userEmail: string) {
    return this.usersService.updateUser(userEmail, {
      isAdm: true,
      refreshToken: null,
    });
  }

  async googleLogin(userData: AuthGoogleDto) {
    const userFound = await this.usersService.findByEmail(userData.email);

    // if (!userFound && userData.accessToken) {
    //   await this.usersService.createUser({
    //     email: userData.email,
    //     name: userData.firstName + ' ' + userData.lastName,
    //     password: '########',
    //     isAdm: userData.isAdm,
    //     username: '########',
    //   });
    // }
  }

  async retrieveGoogleEmail(token: string) {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const userData = await this.httpService.axiosRef.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      config,
    );
    return userData.data.email;
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async refreshTokens(userEmail: string, refreshToken: string) {
    const user = await this.usersService.findByEmail(userEmail);

    if (!user || !user.refreshToken || refreshToken !== user.refreshToken)
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
    });
    await this.updateRefreshToken(user.email, tokens.refreshToken);

    return tokens;
  }

  async refreshGoogleToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async logout(userEmail: string, refreshToken: string) {
    if (userEmail) {
      return await this.updateRefreshToken(userEmail, null);
    }
    if (refreshToken) {
      return await this.revokeGoogleToken(refreshToken);
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }
}
