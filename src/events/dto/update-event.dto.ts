import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateEventDto {

    @IsString()
    @IsOptional()
    name_event: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    price_unit: number;

    @IsDate({ message: 'start_date debe ser una fecha válida' })
    @Type(() => Date)
    @IsOptional()
    start_date: Date;
  
    @IsDate({ message: 'end_date debe ser una fecha válida' })
    @Type(() => Date)
    @IsOptional()
    end_date: Date;
}
