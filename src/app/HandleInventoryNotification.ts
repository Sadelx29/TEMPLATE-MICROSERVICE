import { SAPPOApiInventorySource } from '../infrastructure/adapters/sources/SAPPOApiInventorySource';
import { Inventory } from '../infrastructure/entities/Inventory';
import { InventoryLog } from '../infrastructure/entities/InventoryLog';
import { EventOutbox } from '../infrastructure/entities/EventOutbox';
import { AppDataSource } from '../config/data-source';
import { SyncControl } from '../infrastructure/entities/SyncControl';

import { logger } from '../shared/logger';

export async function handleInventoryNotification(body: any) {
    const { Process, type, eventId, data } = body;
  
    if (Process !== 'Inventory' || !data) {
      return { Success: false, HttpStatusCode: 400, Errors: ['Evento no válido'] };
    }
  
    const inventoryRepo = AppDataSource.getRepository(Inventory);
    const logRepo = AppDataSource.getRepository(InventoryLog);
    const outboxRepo = AppDataSource.getRepository(EventOutbox);
    const syncRepo = AppDataSource.getRepository(SyncControl);
  
    const syncControl = syncRepo.create({
      process: type,
      startedAt: new Date(),
      status: 'IN_PROGRESS',
      message: 'Recepción de evento desde SAP PO',
    });
  
    await syncRepo.save(syncControl);
    logger.info(`[SYNC] ${type} - ${syncControl.id} - IN_PROGRESS`); // Log the sync control ID
  
    try {
      let processed = 0;
  
      for (const entry of data) {
        const source = new SAPPOApiInventorySource(
          process.env.SAP_PO_API_URL as string,
          entry.locationCode,
          entry.internalIds
        );
  
        const inventoryList = await source.getInventory();
        logger.info('traje to lo dato', inventoryList);
  
        for (const item of inventoryList) {
          const existing = await inventoryRepo.findOneBy({
            materialSku: item.materialCode,
            storeCode: item.storeCode,
          });
  
          let operation: 'INSERT' | 'UPDATE' = 'INSERT';
          let previousStock = 0;
  
          if (existing) {
            if (existing.available === item.available) {
              logger.info(`[SKIP] Sin cambios para ${item.materialCode}`);
              continue;
            }
            previousStock = existing.available;
            existing.available = item.available;
            await inventoryRepo.save(existing);
            operation = 'UPDATE';
          } else {
            await inventoryRepo.save(item);
          }
  
          await logRepo.save({
            materialCode: item.materialCode,
            storeCode: item.storeCode,
            operation,
            previousStock,
            newStock: item.available,
            source: 'SAP_PO',
            eventId
          });
  
          await outboxRepo.save({
            eventType: 'InventoryUpdated',
            payload: {
              materialCode: item.materialCode,
              storeCode: item.storeCode,
              quantity: item.available
            },
            status: 'PENDING',
            retryCount: 0
          });
  
          processed++;
        }
      }
  
      syncControl.finishedAt = new Date();
      syncControl.status = 'SUCCESS';
      syncControl.message = `Inventario procesado. ${processed} registros`;
      await syncRepo.save(syncControl);
  
      return { Success: true, HttpStatusCode: 200, Errors: [], Value: { Process, processed } };
    } catch (error: any) {
      logger.error('[ERROR] Inventario', error);
  
      syncControl.finishedAt = new Date();
      syncControl.status = 'FAILED';
      syncControl.message = error.message || 'Error desconocido';
      await syncRepo.save(syncControl);
  
      return {
        Success: false,
        HttpStatusCode: 500,
        Errors: [error.message || 'Error interno']
      };
    }
  }