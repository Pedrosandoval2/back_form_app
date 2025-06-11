import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDto {

    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    firstName: string;

    @IsNotEmpty({ message: 'El lastName es obligatorio' })
    lastName: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
    
    @IsBoolean()
    isMember: boolean;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsNumber()
    phone: number;

}