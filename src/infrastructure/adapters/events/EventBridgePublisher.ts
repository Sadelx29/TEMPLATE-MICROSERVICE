import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventPublisher } from '../../../domain/ports/services/EventPublisher';
import { logger } from '../../../shared/logger';

export class EventBridgePublisher implements EventPublisher {
  private client = new EventBridgeClient({ region: process.env.AWS_REGION });

  async publishInventoryUpdatedEvent(payload: {
    materialCode: string;
    storeCode: string;
    quantity: number;
  }): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: 'inventory.microservice',
          DetailType: 'InventoryUpdated',
          EventBusName: process.env.EVENT_BUS_NAME,
          Detail: JSON.stringify(payload)
        }
      ]
    });

    try {
      const response = await this.client.send(command);
      logger.info(`[EventBridge] Evento enviado: ${JSON.stringify(payload)}`);
      logger.info(`[EventBridge] Resultado: ${JSON.stringify(response.Entries)}`);
    } catch (err: any) {
      logger.error(`[EventBridge] Error al emitir evento: ${err.message}`);
      throw err;
    }
  }
}
