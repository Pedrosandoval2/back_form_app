import { Module } from '@nestjs/common';
import { CustomersEventsController } from './customersEvents.controller';
import { CustomersEventsService } from './customersEvents.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payment } from 'src/payments/payments.entity';
import { customersEvent } from './customersEvent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, customersEvent])],
    controllers: [CustomersEventsController],
    providers: [CustomersEventsService],
    exports: [CustomersEventsService]
})
export class CustomersEventsModule { }