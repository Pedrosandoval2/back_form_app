import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'El teléfono debe ser un número válido' })
    phone: number;

    @IsOptional()
    @IsBoolean()
    isMember: boolean;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

}