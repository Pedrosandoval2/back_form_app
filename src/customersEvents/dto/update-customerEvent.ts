import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, isString, ValidateNested } from "class-validator";
import { PaymentDto } from "src/payments/dto/payment.dto";

export class UpdateCustomerEventDto {
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsNumber()
    @IsNotEmpty()
    eventId: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentDto) // <-- esto transforma cada item en PaymentDto
    payments: PaymentDto[];

    @IsNumber()
    @IsNotEmpty()
    quantity:number;
}
