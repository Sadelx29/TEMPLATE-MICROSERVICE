export interface InventoryRecord {
    materialCode: string;
    ean: string;
    storeCode: string;
    unit: string;
    available: number;
  }
  
  export interface InventorySource {
    getInventory(): Promise<InventoryRecord[]>;
  }
  