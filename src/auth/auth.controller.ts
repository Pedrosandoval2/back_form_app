import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { TokenService } from './token.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() user: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.register(user, res)
    }

    @Post('login')
    login(@Body() loginUser: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginUser, res)
    }

    @Post('update')
    update(@Body() updateAuth: UpdateAuthDto) {
        return this.authService.update(updateAuth)
    }
}