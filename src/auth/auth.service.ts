import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthLogin as UserCredentials } from './entities/auth-login.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async generateJwt(payload: AuthPayloadDto) {
    return await this.jwtService.signAsync(payload);
  }

  private async findUserByEmail(email: string): Promise<UserCredentials> {
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

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    return user;
  }

  async login(userData: AuthLoginDto): Promise<string> {
    const userFound = await this.validateUser(userData);

    const payload: AuthPayloadDto = {
      sub: userFound.id,
      email: userFound.email,
    };

    return this.generateJwt(payload);
  }
}
