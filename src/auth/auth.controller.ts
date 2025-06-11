import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() user: CreateUserDto) {
        console.log("🚀 ~ AuthController ~ register ~ user:", user)
        return this.authService.register(user)
    }

    @Post('login')
    login(@Body() loginUser: LoginDto) {
        return this.authService.login(loginUser)
    }
}