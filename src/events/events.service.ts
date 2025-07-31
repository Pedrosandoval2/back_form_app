import { BadRequestException, HttpException, HttpStatus, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from 'src/users/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

const dataWithTotalCustomers = (events: Event[]) => {
    return events.map((event) => {

        const price = event.price_unit || 0;
        const totalPriceCustomers = event.customersEvents.map(customerEvent => customerEvent.quantity).reduce((acc, curr) => acc + curr, 0);
        const totalPayments = event.customersEvents.reduce((sum, customerEvent) => {
            const paymentsSum = customerEvent.payments?.reduce((acc, payment) => {
                return acc + Number(payment.amount || 0);
            }, 0);
            return sum + paymentsSum;
        }, 0);
        
        const totalQuantityCustomers = event.customersEvents.map(customerEvent => customerEvent.customer).length;

        const total = price * totalPriceCustomers;

        const { customersEvents, ...rest } = event;

        return {
            ...rest,
            totalPayments: Number(totalPayments.toFixed(2)),
            totalQuantityCustomers: totalQuantityCustomers,
            totalAmount: Number(total.toFixed(2)),
        };
    });
}


@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async findAll(query: string, page = 1, limit = 10) {
        try {
            const queryBuilder = this.eventRepository.createQueryBuilder('event')
                .leftJoinAndSelect('event.customersEvents', 'customersEvents')
                .leftJoinAndSelect('customersEvents.payments', 'payments')
                .leftJoinAndSelect('customersEvents.customer', 'customer')
                .skip((page - 1) * limit)
                .take(limit);

            if (query) {
                queryBuilder
                    .where('LOWER(event.name_event) LIKE :query', { query: `${query.toLowerCase()}%` })
                    .orWhere('LOWER(event.description) LIKE :query', { query: `${query.toLowerCase()}%` });
            }

            const [events, total] = await queryBuilder.getManyAndCount();

            const data = dataWithTotalCustomers(events); // ← esta función es tu map para sumar y quitar customersEvents

            return {
                data,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };

        } catch (error) {
            console.log("🚀 ~ EventsService ~ findAll ~ error:", error)
            return Promise.resolve([]);
        }
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
