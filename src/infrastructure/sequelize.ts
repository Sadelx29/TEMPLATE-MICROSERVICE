import { Sequelize } from 'sequelize-typescript';
import { InventoryModel } from './entities/Inventory';
import { InventoryLogModel } from './entities/InventoryLog';
import { SyncControlModel } from './entities/SyncControl';
import { EventOutboxModel } from './entities/EventOutbox';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [InventoryModel, InventoryLogModel, SyncControlModel, EventOutboxModel],
  logging: false,
});

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync();
  } catch (error) {
    console.error('❌ DB connection error:', error);
  }
}
