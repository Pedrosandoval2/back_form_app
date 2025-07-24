import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) { }

  async login(loginUser: LoginDto, res: Response) {
    const user = await this.usersService.signIn(loginUser)

    if (!user) return;
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      email: user.email,
    });

    res.cookie?.('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { accessToken };
  }

  async register(user: CreateUserDto, res: Response) {
    const userRegisted = await this.usersService.register(user)
    if (!userRegisted || userRegisted instanceof Error) return;

    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      firstName: userRegisted.firstName,
      lastName: userRegisted.lastName,
      role: userRegisted.role,
      isActive: userRegisted.isActive,
      email: userRegisted.email,
    });

    res.cookie?.('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { accessToken };
  }

  async update(updateAuth: UpdateAuthDto) {
    return await this.usersService.updateUserByAuth(updateAuth)
  }
}
