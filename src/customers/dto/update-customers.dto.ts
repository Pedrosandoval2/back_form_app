import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto {

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsEmail({}, { message: 'Email inválido' })
    @IsOptional()
    email: string;

    @IsNumber()
    @IsOptional()
    phone: number;

}