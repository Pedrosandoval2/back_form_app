import { Module } from '@nestjs/common';
// import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Customer } from 'src/customers/customer.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Event]),
    ],
    providers: [
        EventsService,
    ],
    controllers: [EventsController],
})
export class EventsModule { }
