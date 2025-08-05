import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class UpdateAuthDto {

    @IsEmail({}, {message: 'Ingresar email correcto'})
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @Length(5, 20)
    password: string;
}