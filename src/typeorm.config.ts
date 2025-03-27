import { DataSource } from 'typeorm';
import { Inventory } from './infrastructure/entities/Inventory';
import { InventoryLog } from './infrastructure/entities/InventoryLog';
import { SyncControl } from './infrastructure/entities/SyncControl';
import { EventOutbox } from './infrastructure/entities/EventOutbox';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: false,
  entities: [Inventory, InventoryLog, SyncControl, EventOutbox],
  migrations: ['migration/*.ts'],
});
