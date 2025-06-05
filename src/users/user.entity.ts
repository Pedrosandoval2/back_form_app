import { IsEmail, IsNotEmpty, Length, Min, validate } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

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
  role: string;

  @Column({ default: true })
  isActive: boolean;
}

const user = new User()

validate(user).then(errors => {
  // errors is an array of validation errors
  if (errors.length > 0) {
    console.log('validation failed. errors: ', errors);
  } else {
    console.log('validation succeed');
  }
});