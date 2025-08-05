import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsEmail({}, {message: 'Email Invalid'})
    @IsString()
    email: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}