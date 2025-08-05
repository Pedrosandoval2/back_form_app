
import { IsBoolean, IsNumber } from "class-validator";
import { CustomersEvent } from "src/customersEvents/customersEvent.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity({ name: 'customers' })
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    firstName: string;

    @Column({ nullable: false, unique: true })
    lastName: string;

    @Column()
    @IsBoolean()
    isMember: boolean;

    @Column({ default: true })
    @IsBoolean()
    isActive: boolean;

    @Column()
    phone: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @OneToMany(() => CustomersEvent, (cp) => cp.customer)
    customersEvents: CustomersEvent[];
}
