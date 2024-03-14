import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthLogin as UserCredentials } from './entities/auth-login.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async generateJwt(payload: AuthPayloadDto) {
    return await this.jwtService.signAsync(payload);
  }

  async findUserByEmail(email: string): Promise<UserCredentials> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
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
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    return user;
  }

  async login(userData: AuthLoginDto): Promise<{ access_token: string }> {
    const userFound = await this.findUserByEmail(userData.email);

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      userFound.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const payload: AuthPayloadDto = {
      sub: userFound.id,
      email: userFound.email,
    };

    return { access_token: await this.generateJwt(payload) };
  }
}
