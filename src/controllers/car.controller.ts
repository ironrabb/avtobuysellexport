import type { Request, Response, NextFunction } from "express";
import { CarService } from "../models/Car.service";
import { AppError, HttpCode, requestLanguage } from "../libs/utils/Errors";
import type { CarInput } from "../libs/types/car";

export class CarController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      const input = {
        ...request.body,
        images: (
          (request.files as Express.Multer.File[] | undefined) ?? []
        ).map((file) => `/images/uploads/${file.filename}`),
      } as CarInput;
      const publishImmediately = Boolean(
        (request as Request & { isAdmin?: boolean }).isAdmin,
      );
      response.status(HttpCode.CREATED).json({
        success: true,
        data: await CarService.create(input, memberId, publishImmediately),
      });
    } catch (error) {
      next(error);
    }
  }
  static async list(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      response.status(HttpCode.OK).json({
        success: true,
        data: await CarService.list(request.query as Record<string, unknown>),
      });
    } catch (error) {
      next(error);
    }
  }
  static async getById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      response.status(HttpCode.OK).json({
        success: true,
        data: await CarService.getById(request.params.id),
      });
    } catch (error) {
      next(error);
    }
  }
  static async listMine(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      response.status(HttpCode.OK).json({
        success: true,
        data: await CarService.listForSeller(memberId),
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateMine(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      const fields = [
        "title",
        "make",
        "model",
        "year",
        "price",
        "mileage",
        "transmission",
        "fuel",
        "region",
        "description",
      ];
      const input = Object.fromEntries(
        fields
          .filter((field) => request.body[field] !== undefined)
          .map((field) => [field, request.body[field]]),
      ) as CarInput;
      const images = (
        (request.files as Express.Multer.File[] | undefined) ?? []
      ).map((file) => `/images/uploads/${file.filename}`);
      response.status(HttpCode.OK).json({
        success: true,
        data: await CarService.updateOwn(
          request.params.id,
          memberId,
          input,
          images,
        ),
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteMine(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      await CarService.deleteOwn(request.params.id, memberId);
      response.status(HttpCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
