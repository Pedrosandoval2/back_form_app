
import { customersEvent } from "src/customersEvents/customersEvent.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity({ name: 'events' })
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name_event: string;

    @Column({nullable: true})
    description: string;

    @Column({ nullable: false, type: 'decimal' })
    price_unit: number;

    @Column({ nullable: false, type: 'date' }) // o 'timestamp' si necesitas hora también
    start_date: Date;

    @Column({ nullable: false, type: 'date' })
    end_date: Date;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column()
    userCreate: String;

    @OneToMany(() => customersEvent, ce => ce.event)
    customersEvents: customersEvent[];
}
