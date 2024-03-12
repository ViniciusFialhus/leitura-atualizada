import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserLoginDto } from './entities/user-login.dto';
import { UserPayload } from './entities/user-payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async generateJwt(payload: UserPayload) {
    return await this.jwtService.signAsync(payload);
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    return user;
  }

  async validateUser(userData: UserLoginDto) {
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

  async login(userData: UserLoginDto): Promise<string> {
    const userFound = await this.validateUser(userData);

    const payload: UserPayload = {
      sub: userFound.id,
      email: userFound.email,
    };

    return this.generateJwt(payload);
  }
}
