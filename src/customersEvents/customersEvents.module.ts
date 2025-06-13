import { Module } from '@nestjs/common';
import { CustomersEventsController } from './customersEvents.controller';
import { CustomersEventsService } from './customersEvents.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payment } from 'src/payments/payments.entity';
import { Event } from 'src/events/event.entity';
import { CustomersEvent } from './customersEvent.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Payment, CustomersEvent, Event])],
    controllers: [CustomersEventsController],
    providers: [CustomersEventsService],
    exports: [CustomersEventsService]
})
export class CustomersEventsModule { }