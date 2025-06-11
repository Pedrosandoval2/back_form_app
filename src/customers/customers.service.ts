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

    create(createDto: CreateCustomerDto) {
        return 'This action adds a new ';
    }

    findAll(): Promise<Customer[]> {
        return this.customersRepository.find();
    }

    async findOne(id: string): Promise<Pick<Customer, 'fullName' | 'isActive' | 'isMember'>> {

        if (!id) throw new BadRequestException('No existe el id');
        try {
            const customer = await this.customersRepository.findOne({ where: { id } })

            if (!customer) throw new Error('Usuario no encontrado');

            return {
                fullName: customer.fullName,
                isMember: customer.isMember,
                isActive: customer.isActive
            }
        } catch (error) {
            console.error('ocurrió un error al obtener un customer: ', error)
            throw new BadRequestException('Error inesperado en customer findOne')
        }

    }

    update(id: string, updateDto: UpdateCustomerDto) {
        return `This action updates a #id `;
    }

    remove(id: string) {
        return `This action removes a #id `;
    }
}
