import { Request, Response } from 'express';
import { handleInventoryNotification } from '../../../app/HandleInventoryNotification';
import { sendError, sendSuccess } from '../../../shared/responseHandler';

export async function postNotification(req: Request, res: Response) {
  try {
    const result = await handleInventoryNotification(req.body);
    result.Success
      ? sendSuccess(res, result.Value, result.HttpStatusCode)
      : sendError(res, result.Errors, result.HttpStatusCode);
  } catch (err: any) {
    sendError(res, [err.message || 'Error interno']);
  }
}
