import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  materialCode!: string;

  @Column({ type: 'varchar' })
  ean!: string;

  @Column({ type: 'varchar' })
  storeCode!: string;

  @Column({ type: 'varchar' })
  unit!: string;

  @Column({ type: 'int' })
  available!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
