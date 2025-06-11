import { BadRequestException, HttpException, HttpStatus, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from 'src/users/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

    ) { }

    findAll() {
        return this.eventRepository.find();
    }

    async findOne(id: number): Promise<Pick<Event, 'name_event' | 'description' | 'price_unit' | 'start_date' | 'end_date'>> {

        if (!id) throw new BadRequestException('No existe el id');
        try {
            const event = await this.eventRepository.findOne({ where: { id } })

            if (!event) throw new Error('Usuario no encontrado');

            return {
                name_event: event.name_event,
                description: event.description,
                price_unit: event.price_unit,
                end_date: event.end_date,
                start_date: event.start_date
            }
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al obtener evento:', errorMessage);
            throw error;
        }

    }

    async createEvent(createEventDto: CreateEventDto, userEmail: Pick<User, 'email'>) {

        if (!createEventDto) throw new BadRequestException('Error event')

        try {

            const eventFound = await this.eventRepository.findOne({
                where: {
                    name_event: createEventDto.name_event
                }
            })

            if (eventFound) {
                return new HttpException('Error for event name', HttpStatus.NOT_FOUND)
            }

            // Crea el nuevo evento con el usuario asociado
            const newEvent = this.eventRepository.create({ ...createEventDto, userCreate: userEmail });
            if (!newEvent) throw new RequestTimeoutException('Error to create event');

            return await this.eventRepository.save(newEvent);
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al crear evento:', errorMessage);
            throw error;
        }
    }

    async updateEvent(id: number, updateEvent: UpdateEventDto) {

        if (!updateEvent) throw new BadRequestException('Error event')

        try {

            const eventFound = await this.eventRepository.findOne({
                where: {
                    id
                }
            })

            if (!eventFound) {
                return new HttpException('Error for event name', HttpStatus.NOT_FOUND)
            }

            // Crea el nuevo evento con el usuario asociado
            const newEvent = Object.assign(eventFound, updateEvent)

            return await this.eventRepository.save(newEvent);
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al actualizar evento:', errorMessage);
            throw error;
        }
    }
}
