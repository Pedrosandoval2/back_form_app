import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-custmers.dto';
import { UpdateCustomerDto } from './dto/update-customers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {

    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>
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


    findAll(): Promise<Customer[]> {
        return this.customersRepository.find();
    }

    async findOne(id: string): Promise<Pick<Customer, 'firstName' | 'lastName' | 'isActive' | 'isMember'>> {

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

    async updateCustomer(id: string, updateDto: UpdateCustomerDto) {
        console.log("🚀 ~ CustomersService ~ updateCustomer ~ updateDto:", updateDto)

        if (!id) throw new BadRequestException('No hay id');

        if (!updateDto) throw new BadRequestException('No hay datos');

        try {
            const existingCustomer = await this.customersRepository.findOne({
                where: { id },
            });

            if (!existingCustomer) {
                throw new BadRequestException('El cliente no existe');
            }

            Object.assign(existingCustomer, updateDto)

            await this.customersRepository.save(existingCustomer);

            return {
                message: 'Usuario actualizado'
            };

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al actualizar customer:', errorMessage);
            throw error;
        }
    }

    async deleteCustomer(id: string) {
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
