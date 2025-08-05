import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-custmers.dto';
import { UpdateCustomerDto } from './dto/update-customers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {

    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>
    ) { }

    async createCustomer(createDto: CreateCustomerDto): Promise<Customer> {
        if (!createDto) {
            throw new BadRequestException('No hay datos');
        }

        try {
            const existingCustomer = await this.customersRepository.findOne({
                where: { firstName: createDto.firstName },
            });

            if (existingCustomer) {
                throw new BadRequestException('El cliente ya existe');
            }

            const newCustomer = this.customersRepository.create(createDto);
            console.log("🚀 ~ CustomersService ~ createCustomer ~ newCustomer:", newCustomer)

            return await this.customersRepository.save(newCustomer);

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al crear customer:', errorMessage);
            throw error;
        }
    }

    async findAll(query: string, page = 1, limit = 10) {
        try {
            const queryBuilder = this.customersRepository.createQueryBuilder('customer').skip((page - 1) * limit).take(limit);
            const totalCustomers = await queryBuilder.getCount();

            if (query) {
                queryBuilder
                    .where('LOWER(customer.firstName) LIKE :query', { query: `${query.toLowerCase()}%` })
                    .orWhere('LOWER(customer.lastName) LIKE :query', { query: `${query.toLowerCase()}%` });

                const data = await queryBuilder.getMany();
                const totalQueryBuilder = await queryBuilder.getCount();

                return {
                    data,
                    page,
                    limit,
                    totalCustomers: totalQueryBuilder,
                    totalPages: Math.ceil(totalQueryBuilder / limit),
                };
            }

            const data = await this.customersRepository.find({
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                data,
                page,
                limit,
                totalCustomers,
                totalPages: Math.ceil(totalCustomers / limit),
            }

        } catch (error) {
            console.log("🚀 ~ UsersService ~ findAll ~ error:", error)
            return Promise.resolve([]);
        }
    }


    async findAllOptions(idEvent?: number) {
        const queryBuilder = this.customersRepository.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.customersEvents', 'customerEvent')
            .leftJoinAndSelect('customerEvent.event', 'event')
            .where('customer.isActive = :isActive', { isActive: true });

        if (idEvent) {
            queryBuilder.andWhere(qb => {
                // 	Crea una subconsulta dentro del QueryBuilder.
                const subQuery = qb.subQuery()
                    // Selecciona los customerId de la tabla intermedia customersEvents.
                    .select('ce.customerId')
                    // Usa la tabla customersEvents (la que relaciona clientes y eventos) con alias ce.
                    .from('customersEvents', 'ce')
                    // Filtra por el id del evento que se pasa como parámetro.
                    .where('ce.eventId = :idEvent')
                    // Devuelve la subconsulta.
                    .getQuery();

                // 	Reemplaza :idEvent con el valor real que pasas a la función.
                return `customer.id NOT IN ${subQuery}`;
            }).setParameter('idEvent', idEvent);
        }

        queryBuilder.select([
            'customer.id',
            'customer.firstName',
            'customer.lastName',
            'customer.isActive',
            'customer.isMember',
            'customer.phone',
            'customer.createdAt',
        ]);
        return await queryBuilder.getMany();
    }



    async findOne(id: number): Promise<Pick<Customer, 'firstName' | 'lastName' | 'isActive' | 'isMember'>> {

        if (!id) throw new BadRequestException('No existe el id');
        try {
            const customer = await this.customersRepository.findOne({ where: { id } })
            if (!customer) throw new BadRequestException('No existe usuarios');

            return {
                firstName: customer.firstName,
                lastName: customer.lastName,
                isMember: customer.isMember,
                isActive: customer.isActive
            }
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al obtener customer:', errorMessage);
            throw error;
        }

    }

    async updateCustomer(id: number, updateDto: UpdateCustomerDto) {
        if (typeof id !== 'number' || isNaN(id)) {
            throw new BadRequestException('ID inválido');
        }

        if (!updateDto || Object.keys(updateDto).length === 0) {
            throw new BadRequestException('No hay datos para actualizar');
        }

        try {
            const customerToUpdate = await this.customersRepository.preload({
                id,
                ...updateDto,
                phone: updateDto.phone ? String(updateDto.phone) : undefined, // Aseguramos que phone sea un string
            });

            if (!customerToUpdate) {
                throw new NotFoundException('El cliente no existe');
            }

            const saved = await this.customersRepository.save(customerToUpdate);

            return {
                message: 'Cliente actualizado correctamente',
                data: saved,
            };
        } catch (error) {
            console.error('Error al actualizar customer:', error?.message || error);
            throw new InternalServerErrorException('Error al actualizar el cliente');
        }
    }


    async deleteCustomer(id: number) {
        if (!id) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.customersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            if (!user.isActive) return { message: 'Usuario ya está desactivado' }

            const newCustomer = Object.assign(user, { isActive: false });
            await this.customersRepository.save(newCustomer)

            return {
                message: 'Usuario descativado con éxito'
            }
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al eliminar customer:', errorMessage);
            throw error;
        }
    }
}
