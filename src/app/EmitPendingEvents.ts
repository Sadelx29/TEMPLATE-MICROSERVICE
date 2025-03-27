import { AppDataSource } from '../config/data-source';
import { EventBridgePublisher } from '../infrastructure/adapters/events/EventBridgePublisher';
import { logger } from '../shared/logger';
import { EventOutbox } from '../infrastructure/entities/EventOutbox';

export async function emitPendingEvents() {
    const eventRepo = AppDataSource.getRepository(EventOutbox);
    const pendingEvents = await eventRepo.findBy({ status: 'PENDING' });
  
    if (pendingEvents.length === 0) {
      logger.info('[Outbox] No hay eventos pendientes');
      return;
    }
  
    const publisher = new EventBridgePublisher();
  
    for (const event of pendingEvents) {
      try {
        await publisher.publishInventoryUpdatedEvent(event.payload);
  
        event.status = 'SENT';
        await eventRepo.save(event);
  
        logger.info(`[Outbox] Evento enviado: ${event.eventType}`);
      } catch (error: any) {
        event.status = 'FAILED';
        event.retryCount += 1;
        await eventRepo.save(event);
  
        logger.error(`[Outbox] Error al enviar evento: ${error.message}`);
      }
    }
  }