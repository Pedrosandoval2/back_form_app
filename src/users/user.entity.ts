import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, Length, Min } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  @Exclude()
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

  @Column({ nullable: true })
  refresh_token: string;
}
