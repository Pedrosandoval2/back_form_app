import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hasSpaces } from './utils/hasSpaces';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '../auth/dto/login-user.dto';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtServise: JwtService
    ) { }

    async register({ email, firstName, lastName, password }: CreateUserDto) {
        if (!email) throw new BadRequestException('No hay usuario para crear');
        if (hasSpaces(password)) {
            return new HttpException('Error in password', HttpStatus.CONFLICT)
        }
        try {
            const userFound = await this.usersRepository.findOne({
                where: { firstName }
            })

            if (userFound && userFound.email === email) {
                return new HttpException('User alreday exists', HttpStatus.CONFLICT)
            }

            if (hasSpaces(password)) {
                return new HttpException('Error in password', HttpStatus.CONFLICT)
            }
            const payload = { email };

            const access_token = await this.jwtServise.signAsync(payload)

            const newUser = this.usersRepository.create({
                email,
                password: await bcryptjs.hash(password, 12),
                firstName,
                lastName
            })

            if (!newUser) throw new BadRequestException('No se ha podido crear el usuario');

            this.usersRepository.save(newUser)
            return {
                access_token,
                user: {
                    id: newUser.id,
                    firstName,
                    email,
                }
            }

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al crear usuario:', errorMessage);
            throw error;
        }
    }

    async signIn({ email, password }: LoginDto) {

        if (!email || !password) throw new HttpException('not credentials', HttpStatus.CONFLICT)

        try {

            const userFound = await this.usersRepository.findOneBy({ email })

            if (!userFound) {
                throw new HttpException('user not found', HttpStatus.CONFLICT)
            }

            const isMatch = await bcryptjs.compare(password, userFound.password);

            if (!isMatch) {
                throw new HttpException('Password does not match', HttpStatus.CONFLICT);
            }

            if (hasSpaces(password)) {
                throw new HttpException('password does not match', HttpStatus.CONFLICT)
            }

            const payload = { email };

            const access_token = await this.jwtServise.signAsync(payload)

            return {
                access_token,
                user: {
                    id: userFound.id,
                    email,
                    username: userFound.firstName,
                }
            }

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al hacer login:', errorMessage);
            throw error;
        }


    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<Omit<User, 'password'>> {
        if (!id) throw new BadRequestException('No existe el id');

        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            return {
                id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            };

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al obtener usuario:', errorMessage);
            throw error;
        }

    }

    async findOneByEmail(email: string): Promise<Omit<User, 'password'>> {
        if (!email) throw new BadRequestException('No existe el id');

        try {
            const user = await this.usersRepository.findOne({ where: { email } });

            if (!user) throw new Error('Usuario no encontrado');

            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            };

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al obtener usuario:', errorMessage);
            throw error;
        }

    }

    async updateUser(id: string, userUpdate: UpdateUserDto): Promise<Pick<User, 'firstName' | 'email'>> {
        if (!id) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            Object.assign(user, userUpdate);
            this.usersRepository.save(user);

            return {
                firstName: user.firstName,
                email: user.email,
            }

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al actualizar usuario:', errorMessage);
            throw error;
        }

    }

    async updateUserByAuth(userUpdate: UpdateAuthDto) {
        if (!userUpdate) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.usersRepository.findOne({ where: { email: userUpdate.email } });

            if (!user) throw new Error('Usuario no encontrado');

            if (hasSpaces(userUpdate.password)) throw new HttpException('Error in password', HttpStatus.CONFLICT)

            Object.assign(user, {
                email: userUpdate.email,
                password: await bcryptjs.hash(userUpdate.password, 12),
            });
            await this.usersRepository.save(user);

            return {
                message: 'Usuario actualizado'
            }

        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al actualizar usuario:', errorMessage);
            throw error;
        }

    }

    async deleteUser(id: string) {
        if (!id) throw new Error('ID inválido para actualizar el usuario');

        try {
            const user = await this.usersRepository.findOne({ where: { id } });

            if (!user) throw new Error('Usuario no encontrado');

            if (!user.isActive) return { message: 'Usuario ya está desactivado' }

            Object.assign(user, { isActive: false });
            this.usersRepository.save(user)

            return {
                message: 'Usuario descativado con éxito'
            }
        } catch (error) {
            const errorMessage = error?.message || 'Error desconocido';
            console.error('Error al desactivar usuario:', errorMessage);
            throw error;
        }
    }

}