import { Request, Response } from "express";
import { AppDataSource } from "../../../config/data-source";
import { Inventory } from "../../../infrastructure/entities/Inventory";
import { sendError, sendSuccess } from "../../../shared/responseHandler";


// SWAGGER DOCUMENTATION

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Obtiene el inventario de un material en una tienda
 *     tags: [Inventario]
 *     parameters:
 *       - in: query
 *         name: materialCode
 *         required: true
 *         description: Código del material
 *         schema:
 *           type: string
 *       - in: query
 *         name: storeCode
 *         required: true
 *         description: Código de la tienda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario del material en la tienda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inventario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */



export async function getInventory(req: Request, res: Response) {
  const materialCode = req.query.materialCode as string;
  const storeCode = req.query.storeCode as string;

  if (!materialCode || !storeCode) {
    return sendError(res, ["materialCode y storeCode son requeridos"], 400);
  }

  try {
    const inventoryRepo = AppDataSource.getRepository(Inventory);
    const inventory = await inventoryRepo.findOneBy({ materialCode, storeCode });

    if (!inventory) {
      return sendError(res, ["Inventario no encontrado"], 404);
    }

    sendSuccess(res, inventory);
  } catch (err: any) {
    sendError(res, [err.message || "Error interno"]);
  }
}
