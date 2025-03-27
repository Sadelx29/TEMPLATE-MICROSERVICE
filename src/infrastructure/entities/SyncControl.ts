import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sync_control')
export class SyncControl {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  process!: 'INIT_LOAD' | 'INCREMENTAL';

  @Column({ type: 'timestamp' })
  startedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt!: Date;

  @Column()
  status!: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}