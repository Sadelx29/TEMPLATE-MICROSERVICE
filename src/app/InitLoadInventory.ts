import { SAPPOApiInventorySource } from '../infrastructure/adapters/sources/SAPPOApiInventorySource';
import { AppDataSource } from '../config/data-source';
import { Inventory } from '../infrastructure/entities/Inventory';
import { InventoryLog } from '../infrastructure/entities/InventoryLog';
import { SyncControl } from '../infrastructure/entities/SyncControl';
import { EventOutbox } from '../infrastructure/entities/EventOutbox';
import { logger } from '../shared/logger';


export async function initLoadInventory(locationCode: string, internalIds: number[]) {
    const inventoryRepo = AppDataSource.getRepository(Inventory);
    const logRepo = AppDataSource.getRepository(InventoryLog);
    const syncRepo = AppDataSource.getRepository(SyncControl);
    const outboxRepo = AppDataSource.getRepository(EventOutbox);
  
    const syncControl = syncRepo.create({
      process: 'INIT_LOAD',
      startedAt: new Date(),
      status: 'IN_PROGRESS',
      message: 'Carga inicial desde SAP PO',
    });
  
    await syncRepo.save(syncControl);
  
    try {
      const source = new SAPPOApiInventorySource(
        process.env.SAP_PO_API_URL as string,
        locationCode,
        internalIds
      );
  
      const records = await source.getInventory();
      let processed = 0;
  
      for (const item of records) {
        const existing = await inventoryRepo.findOneBy({
          materialSku: item.materialCode,
          storeCode: item.storeCode,
        });
  
        let operation: 'INSERT' | 'UPDATE' = 'INSERT';
        let previousStock = 0;
  
        if (existing) {
          if (existing.available === item.available) {
            logger.info(`[SKIP] Sin cambios para ${item.materialCode} - ${item.storeCode}`);
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
          source: 'INIT_LOAD',
          eventId: `init-load-${syncControl.id}`,
        });
  
        await outboxRepo.save({
          eventType: 'InventoryUpdated',
          payload: {
            materialCode: item.materialCode,
            storeCode: item.storeCode,
            quantity: item.available,
          },
          status: 'PENDING',
          retryCount: 0,
        });
  
        logger.info(`[INIT_LOAD] ${operation} -> ${item.materialCode} en ${item.storeCode}`);
        processed++;
      }
  
      syncControl.finishedAt = new Date();
      syncControl.status = 'SUCCESS';
      syncControl.message = `Carga inicial finalizada con ${processed} registros procesados`;
      await syncRepo.save(syncControl);
  
      logger.info(`[SYNC OK] Carga inicial completada exitosamente`);
    } catch (error: any) {
      logger.error('[SYNC ERROR] Error en carga inicial', error);
  
      syncControl.finishedAt = new Date();
      syncControl.status = 'FAILED';
      syncControl.message = error.message || 'Error desconocido';
      await syncRepo.save(syncControl);
    }
  }