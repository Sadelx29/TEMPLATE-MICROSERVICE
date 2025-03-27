import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  materialCode!: string;

  @Column()
  storeCode!: string;

  @Column()
  operation!: 'INSERT' | 'UPDATE';

  @Column()
  previousStock!: number;

  @Column()
  newStock!: number;

  @Column()
  source!: 'INIT_LOAD' | 'SAP_PO';

  @Column()
  eventId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}