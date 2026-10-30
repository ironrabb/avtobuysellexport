import type { Request, Response, NextFunction } from 'express';
import { CarService } from '../models/Car.service';
import { AppError, requestLanguage } from '../libs/utils/Errors';
import type { CarInput } from '../libs/types/car';

export class CarController {
  static async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError('UNAUTHORIZED', 401);
      const input = { ...request.body, images: ((request.files as Express.Multer.File[] | undefined) ?? []).map((file) => `/images/uploads/${file.filename}`) } as CarInput;
      response.status(201).json({ success: true, data: await CarService.create(input, memberId) });
    } catch (error) { next(error); }
  }
  static async list(request: Request, response: Response, next: NextFunction): Promise<void> {
    try { requestLanguage(request); response.json({ success: true, data: await CarService.list(request.query as Record<string, unknown>) }); }
    catch (error) { next(error); }
  }
  static async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try { requestLanguage(request); response.json({ success: true, data: await CarService.getById(request.params.id) }); }
    catch (error) { next(error); }
  }
}
