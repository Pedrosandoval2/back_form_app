import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        if (!id) throw new BadRequestException('No existe el id');
        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            return user;

        } catch (error) {
            console.error('Ubo un error al obtener al usuario: ', error)

            throw new BadRequestException('Error inesperado al obtener el usuario')
        }

    }

    createUser(user: CreateUserDto) {
        if (!user) throw new BadRequestException('No hay usuario para crear');
        try {
            const task = this.usersRepository.create(user)

            if (!task) throw new BadRequestException('No se ha podido crear el usuario');

            return this.usersRepository.save(task)

        } catch (error) {
            console.error('Error al crear usuario: ', error)
            throw new BadRequestException('Error inesperado al guardar el usuario');
        }

    }

    async updateUser(id: string, userUpdate: UpdateUserDto): Promise<User> {
        if (!id) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            Object.assign(user, userUpdate);

            return this.usersRepository.save(user);

        } catch (error) {

            console.error('Error al actualizar al usuario: ', error)
            throw new BadRequestException('Hubo un error al actualizar al usuario')
        }


    }

    async deleteUser(id: string) {
        if (!id) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            if (!user.isActive) return { message: 'Usuario ya está desactivado' }

            Object.assign(user, { isActive: false });

            return this.usersRepository.save(user)
        } catch (error) {
            console.error('Error al desactivar al usuario: ', error)
            throw new BadRequestException('Hubo un error al desactivar al usuario')
        }
    }

}