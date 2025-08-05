import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateCustomerEventDto } from './dto/create-customerEvent';
import { UpdateCustomerEventDto } from './dto/update-customerEvent';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEvent } from './customersEvent.entity';
import { Customer } from 'src/customers/customer.entity';
import { Event } from 'src/events/event.entity';
import { Payment } from 'src/payments/payments.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomersEventsService {

    constructor(
        @InjectRepository(CustomersEvent)
        private readonly customersEventRepo: Repository<CustomersEvent>,

        @InjectRepository(Event)
        private readonly eventRepo: Repository<Event>,

        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,

        private readonly dataSource: DataSource,
    ) { }

    async createCustomerEvent(createDto: CreateCustomerEventDto) {
        try {
            const exists = await this.customersEventRepo.findOne({
                where: {
                    customer: { id: createDto.customerId },
                    event: { id: createDto.eventId },
                },
            });

            if (exists) {
                throw new BadRequestException('Este cliente ya está registrado en este evento');
            }

            const event = await this.eventRepo.findOne({
                where: {
                    id: createDto.eventId
                }
            })

            if (!event) {
                throw new BadRequestException('Este evento no está registrado');
            }

            // 1. Guardar primero customerEvent sin pagos
            const customerEvent = await this.customersEventRepo.save(
                this.customersEventRepo.create({
                    customer: { id: createDto.customerId },
                    event: { id: createDto.eventId },
                    description: createDto.description,
                    quantity: createDto.quantity,
                    total_price: event.price_unit * createDto.quantity
                })
            );

            // 2. Crear pagos ya con el customerEvent persistido
            // No debería de crear aquí, sino en su propio 
            const payments = createDto.payments.map((p) =>
                this.paymentRepo.create({
                    method: p.method,
                    amount: p.amount,
                    customersEvent: customerEvent
                })
            );

            // 3. Guardar todos los pagos
            await this.paymentRepo.save(payments);

            return {
                message: 'Se guardó con éxito',
                customerEventId: customerEvent.id,
            };
        } catch (error) {
            console.error('❌ Error creating customer event:', error);
            throw new InternalServerErrorException('Error creating customer event');
        }
    }

    async findAll(id: number) {
        const queryBuilder = this.customersEventRepo.createQueryBuilder('customersEvent')
            .leftJoinAndSelect('customersEvent.event', 'event')
            .leftJoinAndSelect('customersEvent.payments', 'payments')
            .leftJoinAndSelect('customersEvent.customer', 'customer')
            .where('customersEvent.event.id = :id', { id });

        queryBuilder.select([
            'customersEvent.id',
            'customersEvent.description',
            'customersEvent.isActive',
            'customersEvent.quantity',
            'customersEvent.total_price',
            'customersEvent.createdAt',

            'customer.id',
            'customer.firstName',
            'customer.lastName',
            'customer.phone',
            'customer.isMember',
            'customer.isActive',
            'customer.createdAt',

            'event.id',
            'event.name_event',

            'payments.id',
            'payments.method',
            'payments.amount',
            'payments.createdAt',
        ])

        const customerEvent = await queryBuilder.getMany();
        if (!customerEvent) {
            throw new NotFoundException(`CustomerEvent with ID ${id} not found`);
        }
        return customerEvent;
    }

    async findOne(id: number) {
        if (!id) throw new BadRequestException('No existe el id');
        try {
            const customerEvent = await this.customersEventRepo.findOne({
                where: { id },
                relations: ['customer', 'event', 'payments'],
            });

            if (!customerEvent) throw new NotFoundException('CustomerEvent no encontrado');

            return customerEvent;
        } catch (error) {
            console.error('Error al obtener CustomerEvent:', error);
            throw new InternalServerErrorException('Error al obtener CustomerEvent');
        }
    }


    async update(id: number, updateDto: UpdateCustomerEventDto) {
        const { customerId, eventId, description, quantity, payments } = updateDto;

        // Pre-cargar la entidad con posibles cambios simples
        const customerEvent = await this.customersEventRepo.preload({
            id,
            ...(customerId && { customer: { id: customerId } as Customer }),
            ...(eventId && { event: { id: eventId } as Event }),
            ...(description !== undefined && { description }),
            ...(quantity !== undefined && { quantity }),
        });

        if (!customerEvent) {
            throw new NotFoundException(`CustomerEvent con id=${id} no encontrado.`);
        }

        // Si no hay cambios en payments, guardamos y salimos
        if (!payments) {
            await this.customersEventRepo.save(customerEvent);
            return { message: 'Actualizado con éxito (sin cambios en pagos)' };
        }

        // Si hay pagos, utilizamos transacción
        await this.dataSource.transaction(async (manager) => {
            // Eliminamos pagos antiguos
            await manager.getRepository(Payment).delete({ customersEvent: { id } });

            // Creamos los nuevos
            const newPayments = payments.map(p =>
                manager.getRepository(Payment).create({
                    method: p.method,
                    amount: p.amount,
                    customersEvent: customerEvent,
                })
            );
            await manager.getRepository(Payment).save(newPayments);

            // Asociamos los pagos a la entidad principal
            customerEvent.payments = newPayments;

            // Finalmente guardamos los cambios en CustomerEvent
            await manager.getRepository('customersEvents').save(customerEvent);
        });

        return { message: 'Actualizado con éxito' };
    }



    async remove(id: number) {
        const customerEvent = await this.customersEventRepo.findOneBy({ id });

        if (!customerEvent) {
            throw new NotFoundException(`CustomerEvent con ID ${id} no encontrado`);
        }

        const newCustomerEvent = Object.assign(customerEvent, { isActive: false })

        await this.customersEventRepo.save(newCustomerEvent);

        return { message: `CustomerEvent con ID ${id} eliminado correctamente` };
    }

}
