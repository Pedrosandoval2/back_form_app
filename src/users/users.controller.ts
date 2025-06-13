import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('/:id')
    findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
        return this.usersService.findOne(id);
    }

    @Patch('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() userUpdate: UpdateUserDto
    ): Promise<Pick<User, 'firstName' | 'email'>> {
        return this.usersService.updateUser(id, userUpdate)
    }

    @Put('/:id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id)
    }

}