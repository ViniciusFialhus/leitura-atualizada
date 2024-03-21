import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthLogin as UserCredentials } from './entities/auth-login.entity';
import { AuthGoogleDto } from './dtos/auth-google.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async generateJwt(payload: AuthPayloadDto) {
    return await this.jwtService.signAsync(payload);
  }

  async findUserByEmail(email: string): Promise<UserCredentials> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('Email não encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async validateUser(
    userData: Partial<AuthLoginDto>,
  ): Promise<UserCredentials> {
    const user = await this.findUserByEmail(userData.email);

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Email ou senha incorretos.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(userData: AuthLoginDto): Promise<{ accessToken: string }> {
    const userFound = await this.validateUser(userData);

    const payload: AuthPayloadDto = {
      sub: userFound.id,
      email: userFound.email,
    };

    return { accessToken: await this.generateJwt(payload) };
  }

  async googleLogin(userData: AuthGoogleDto): Promise<{ accessToken: string }> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!userFound && userData.accessToken) {
      await this.usersService.createUser({
        email: userData.email,
        name: userData.firstName + ' ' + userData.lastName,
        password: '########',
        isAdm: userData.isAdm,
        username: '########',
      });
    }

    return userData;
  }
}
