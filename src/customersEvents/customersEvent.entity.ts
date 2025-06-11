
import { IsString } from "class-validator";
import { Customer } from "src/customers/customer.entity";
import { Event } from "src/events/event.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

@Entity({ name: 'customersEvents' })
export class customersEvent {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.customersEvents)
    customer: Customer;

    @ManyToOne(() => Event, (event) => event.customersEvents)
    event: Event;

    @Column()
    description: string;

    @IsString()
    payment_method: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
}
