import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async login(loginUser: LoginDto) {
    return await this.usersService.signIn(loginUser)
  }

  async register(user: CreateUserDto) {
    return await this.usersService.register(user)
  }

  async update(updateAuth: UpdateAuthDto) {
    return await this.usersService.updateUserByAuth(updateAuth)
  }
}
