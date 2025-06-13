import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateCustomerEventDto } from './dto/create-customerEvent';
import { UpdateCustomerEventDto } from './dto/update-customerEvent';
import { InjectRepository } from '@nestjs/typeorm';
import { customersEvent } from './customersEvent.entity';
import { Customer } from 'src/customers/customer.entity';
import { Event } from 'src/events/event.entity';
import { Payment } from 'src/payments/payments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersEventsService {

    constructor(
        @InjectRepository(customersEvent)
        private customersEventRepo: Repository<customersEvent>,

        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
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

            // 1. Guardar primero customerEvent sin pagos
            const customerEvent = await this.customersEventRepo.save(
                this.customersEventRepo.create({
                    customer: { id: createDto.customerId },
                    event: { id: createDto.eventId },
                    description: createDto.description,
                })
            );

            // 2. Crear pagos ya con el customerEvent persistido
            // No debería de crear aquí, sino en su propio 
            const payments = createDto.payments.map((p) =>
                this.paymentRepo.create({
                    method: p.method,
                    amount: p.amount,
                    customersEvent: customerEvent,
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

    async findAll() {
        return await this.customersEventRepo.find({
            relations: ['customer', 'event', 'payments'], // ajusta según tus relaciones
        });
    }

    async findOne(id: number) {
        const customerEvent = await this.customersEventRepo.findOne({
            where: { id },
            relations: ['customer', 'event', 'payments'],
        });

        if (!customerEvent) {
            throw new NotFoundException(`CustomerEvent con ID ${id} no encontrado`);
        }

        return customerEvent;
    }

    async update(id: number, updateDto: UpdateCustomerEventDto) {
        const customerEvent = await this.customersEventRepo.findOne({
            where: { id },
            relations: ['payments'],
        });

        if (!customerEvent) {
            throw new NotFoundException('Relación customer-event no encontrada');
        }

        // Actualizar relaciones por ID
        if (updateDto.customerId) {
            customerEvent.customer = { id: updateDto.customerId } as Customer;
        }

        if (updateDto.eventId) {
            customerEvent.event = { id: updateDto.eventId } as Event;
        }

        // Actualizar otros campos simples
        if (updateDto.description) {
            customerEvent.description = updateDto.description;
        }

        // Eliminar pagos actuales y agregar los nuevos
        if (updateDto.payments && updateDto.payments.length > 0) {
            await this.paymentRepo.delete({ customersEvent: { id } });

            const newPayments = updateDto.payments.map((p) =>
                this.paymentRepo.create({
                    method: p.method,
                    amount: p.amount,
                    customersEvent: customerEvent,
                }),
            );

            customerEvent.payments = newPayments;
        }

        await this.customersEventRepo.save(customerEvent);

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
