import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {

    constructor(
        private readonly eventsService: EventsService
    ) { }

    @Get()
    findAll() {
        return this.eventsService.findAll();
    }

    @Post('create')
    create(
        @Body() event: CreateEventDto, @Req() req: Request
    ) {
        // Assuming AuthGuard attaches user info to req['user']
        const userEmail = req['user'].email;

        // Optionally, you may want to pass user info to the service
        return this.eventsService.createEvent(event, userEmail);
    }

    @Post('update/:id')
    update(
        @Param('id') id: number,
        @Body() event: CreateEventDto
    ) {
        // Optionally, you may want to pass user info to the service
        return this.eventsService.updateEvent(id, event);
    }


}
