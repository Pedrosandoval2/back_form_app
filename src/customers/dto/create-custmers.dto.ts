import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCustomerDto {

    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    firstName: string;

    @IsNotEmpty({ message: 'El lastName es obligatorio' })
    lastName: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsNumber()
    phone: number;

}