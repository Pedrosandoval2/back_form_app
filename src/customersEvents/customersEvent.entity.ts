import { Customer } from "src/customers/customer.entity";
import { Event } from "src/events/event.entity";
import { Payment } from "src/payments/payments.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"

@Entity({ name: 'customersEvents' })
export class CustomersEvent {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.customersEvents, { eager: true })
    customer: Customer;

    @ManyToOne(() => Event, (event) => event.customersEvents, { eager: true })
    event: Event;

    @Column()
    description: string;

    @OneToMany(() => Payment, (payment) => payment.customersEvent, { cascade: true, eager: true })
    payments: Payment[];

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column({default: true})
    isActive: boolean;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;
}
