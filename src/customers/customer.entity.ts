
import { IsBoolean } from "class-validator";
import { customersEvent } from "src/customersEvents/customersEvent.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity({ name: 'customers' })
export class Customer {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false, unique: true })
    fullName: string;

    @Column()
    @IsBoolean()
    isMember: boolean;

    @Column({ default: true })
    @IsBoolean()
    isActive: boolean;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @OneToMany(() => customersEvent, (cp) => cp.customer)
    customersEvents: customersEvent[];
}
