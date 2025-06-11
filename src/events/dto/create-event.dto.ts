import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createEventDto {

    @IsString()
    @IsNotEmpty()
    name_event: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price_unit: number;

    @IsNotEmpty()
    @IsDate({ message: 'start_date debe ser una fecha válida' })
    @Type(() => Date)
    start_date: Date;
  
    @IsNotEmpty()
    @IsDate({ message: 'end_date debe ser una fecha válida' })
    @Type(() => Date)
    end_date: Date;
}
