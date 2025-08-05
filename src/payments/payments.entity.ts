import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CustomersEvent } from 'src/customersEvents/customersEvent.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string; // efectivo, yape, etc.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  
  @Exclude()
  @ManyToOne(() => CustomersEvent, (ce) => ce.payments, { onDelete: 'CASCADE' })
  customersEvent: CustomersEvent;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;
}
