import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async login(loginUser: LoginDto) {
    return await this.usersService.signIn(loginUser)
  }

  async register(user: CreateUserDto) {
    console.log("🚀 ~ AuthService ~ register ~ user:", user)
    return await this.usersService.register(user)
  }

}
