import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() user: CreateUserDto) {
        return this.authService.register(user)
    }

    @Post('login')
    login(@Body() loginUser: LoginDto) {
        return this.authService.login(loginUser)
    }

    @Post('update')
    update(@Body() updateAuth: UpdateAuthDto) {
        return this.authService.update(updateAuth)
    }
}