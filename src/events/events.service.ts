import { BadRequestException, HttpException, HttpStatus, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { createEventDto } from './dto/create-event.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

    ) { }

    async createEvent(event: createEventDto, userEmail: Pick<User, 'email'>) {

        if (!event) throw new BadRequestException('Error event')

        try {

            const eventFound = await this.eventRepository.findOne({
                where: {
                    name_event: event.name_event
                }
            })

            if (eventFound) {
                return new HttpException('Error for event name', HttpStatus.NOT_FOUND)
            }

            // Crea el nuevo evento con el usuario asociado
            const newEvent = this.eventRepository.create({ ...event, userCreate: userEmail });
            if (!newEvent) throw new RequestTimeoutException('Error to create event');

            return await this.eventRepository.save(newEvent);
        } catch (error) {

            console.error('Error creating event:', error);

            throw new HttpException(
                'Error saving event',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
