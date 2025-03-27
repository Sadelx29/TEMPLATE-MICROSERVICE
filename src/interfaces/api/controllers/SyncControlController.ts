import { Request, Response } from 'express';
import { SyncControl  } from '../../../infrastructure/entities/SyncControl';
import { sendError, sendSuccess } from '../../../shared/responseHandler';
import { AppDataSource } from '../../../config/data-source';

export async function getSyncControl(req: Request, res: Response) {
    try {
      const syncRepo = AppDataSource.getRepository(SyncControl);
      const result = await syncRepo.find({ order: { createdAt: 'DESC' } });
  
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, [err.message || 'Error interno']);
    }
  }