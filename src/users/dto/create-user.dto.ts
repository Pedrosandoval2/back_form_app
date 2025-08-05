import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    firstName: string;

    @IsNotEmpty({ message: 'El lastName es obligatorio' })
    lastName: string;

    @IsNotEmpty({ message: 'El password es obligatorio' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
}