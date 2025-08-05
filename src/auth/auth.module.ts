
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token.service';


@Module({
    imports: [UsersModule],
    providers: [AuthService, TokenService],
    controllers: [AuthController],
    exports: [TokenService]
})
export class AuthModule { }