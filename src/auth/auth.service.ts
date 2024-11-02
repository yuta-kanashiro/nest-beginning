import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtPayload } from '../types/jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, status } = CreateUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status,
      },
    });
  }

  async singIn(CredentialsDto: CredentialsDto): Promise<{ token: string }> {
    const { email, password } = CredentialsDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id,
        username: user.name,
        status: user.status,
      };
      const token = this.jwtService.sign(payload);
      return { token }; // objectで返している
    }

    throw new UnauthorizedException();
  }
}
