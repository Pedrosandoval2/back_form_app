import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { customersEvent } from 'src/customersEvents/customersEvent.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string; // efectivo, yape, etc.

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  
  @Exclude()
  @ManyToOne(() => customersEvent, (ce) => ce.payments, { onDelete: 'CASCADE' })
  customersEvent: customersEvent;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;
}
