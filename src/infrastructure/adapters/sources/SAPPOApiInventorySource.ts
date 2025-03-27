import axios from 'axios';
import { InventorySource, InventoryRecord } from '../../../domain/ports/sources/InventorySource';

export class SAPPOApiInventorySource implements InventorySource {
  constructor(
    private baseUrl: string,
    private locationCode: string,
    private internalIds: number[]
  ) {}

  async getInventory(): Promise<InventoryRecord[]> {
    const response = await axios.post(`${this.baseUrl}/inventory`, {
      LocationCode: this.locationCode,
      InternalIds: this.internalIds
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Respuesta inválida desde SAP PO');
    }

    return response.data
      .filter((item: any) => !item.Error)
      .map((item: any) => ({
        materialCode: String(item.Internal_id),
        storeCode: item.Location,
        ean: '', // No provisto por SAP PO aquí
        unit: item.Unit,
        available: item.Stock
      }));
  }
}
