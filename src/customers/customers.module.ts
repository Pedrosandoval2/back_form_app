import { Module } from '@nestjs/common';
import { customersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Customer]),],
    controllers: [customersController],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule { }