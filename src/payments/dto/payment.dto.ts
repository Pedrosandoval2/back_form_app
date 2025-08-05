import { IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  method: string;

  @IsNumber()
  amount: number;
}
