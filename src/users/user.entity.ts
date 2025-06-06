import { IsBoolean, IsEmail, IsNotEmpty, Length, Min, validate } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNotEmpty()
  @Min(3)
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @IsNotEmpty()
  @Length(5, 20)
  password: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ default: 'user' })
  @IsNotEmpty()
  role: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;
}
