export interface EventPublisher {
    publishInventoryUpdatedEvent(payload: {
      materialCode: string;
      storeCode: string;
      quantity: number;
    }): Promise<void>;
  }
  