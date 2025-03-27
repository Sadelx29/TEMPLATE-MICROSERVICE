import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('event_outbox')
export class EventOutbox {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  eventType!: string;

  @Column({ type: 'jsonb' })
  payload!: any;

  @Column()
  status!: 'PENDING' | 'SENT' | 'FAILED';

  @Column({ default: 0 })
  retryCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}