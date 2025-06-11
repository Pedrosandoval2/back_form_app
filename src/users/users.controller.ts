import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
        return this.usersService.findOne(id);
    }

    // @Post('/signIn')
    // singIn(@Body() userSingIn: LoginDto) {
    //     return this.usersService.signIn(userSingIn)
    // }

    // @Post('/register')
    // register(@Body() user: CreateUserDto) {
    //     return this.usersService.register(user);
    // }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    updateUser(
        @Param('id') id: string,
        @Body() userUpdate: UpdateUserDto
    ): Promise<Pick<User, 'firstName' | 'email'>> {
        return this.usersService.updateUser(id, userUpdate)
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id)
    }

}