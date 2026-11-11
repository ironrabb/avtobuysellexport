import mongoose from "mongoose";
import { CarStatus } from "../libs/enums/car.enum";
import CarModel from "../schema/Car.model";
import type { CarInput } from "../libs/types/car";
import { AppError, HttpCode } from "../libs/utils/Errors";
import { FavoriteService } from "./Favorite.service";

export class CarService {
  static async create(
    input: CarInput,
    sellerId: string,
    publishImmediately = false,
  ): Promise<Record<string, unknown>> {
    try {
      const car = await CarModel.create({
        ...input,
        sellerId,
        status: publishImmediately ? CarStatus.ACTIVE : CarStatus.PENDING,
      });
      return car.toJSON();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError)
        throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async list(
    query: Record<string, unknown>,
  ): Promise<{ items: unknown[]; page: number; limit: number; total: number }> {
    try {
      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
      const filter: Record<string, unknown> = { status: CarStatus.ACTIVE };
      if (typeof query.q === "string" && query.q.trim())
        filter.$text = { $search: query.q.trim() };
      for (const key of ["make", "model", "region", "fuel", "transmission"])
        if (typeof query[key] === "string" && query[key])
          filter[key] = query[key];
      if (query.minPrice || query.maxPrice)
        filter.price = {
          ...(query.minPrice ? { $gte: Number(query.minPrice) } : {}),
          ...(query.maxPrice ? { $lte: Number(query.maxPrice) } : {}),
        };
      const sortOrder: Record<string, 1 | -1> =
        query.sort === "cheap"
          ? { price: 1 }
          : query.sort === "expensive"
            ? { price: -1 }
            : { createdAt: -1 };
      const [items, total] = await Promise.all([
        CarModel.find(filter)
          .sort(sortOrder)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("sellerId", "name")
          .lean(),
        CarModel.countDocuments(filter),
      ]);
      return { items, page, limit, total };
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async getById(id: string): Promise<Record<string, unknown>> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const car = await CarModel.findOne({ _id: id, status: CarStatus.ACTIVE })
        .populate("sellerId", "name phone")
        .lean();
      if (!car) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      return car as unknown as Record<string, unknown>;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async listForSeller(sellerId: string): Promise<unknown[]> {
    try {
      return await CarModel.find({ sellerId }).sort({ createdAt: -1 }).lean();
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async updateOwn(
    id: string,
    sellerId: string,
    input: Partial<CarInput>,
    images?: string[],
  ): Promise<Record<string, unknown>> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const update: Record<string, unknown> = {
        ...input,
        status: CarStatus.PENDING,
      };
      const current = (await CarModel.findOne({ _id: id, sellerId })
        .select("images status")
        .lean()) as unknown as { images?: string[]; status?: CarStatus } | null;
      if (!current) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      if (
        [
          CarStatus.PAUSED,
          CarStatus.BLOCKED,
          CarStatus.SOLD,
          CarStatus.ARCHIVED,
        ].includes(current.status as CarStatus)
      )
        throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
      if (images?.length) {
        if ((current.images?.length ?? 0) + images.length > 10)
          throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
        update.images = [...(current.images ?? []), ...images];
      }
      const car = await CarModel.findOneAndUpdate(
        { _id: id, sellerId },
        { $set: update },
        { new: true, runValidators: true },
      ).lean();
      if (!car) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      return car as unknown as Record<string, unknown>;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof mongoose.Error.ValidationError)
        throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async deleteOwn(id: string, sellerId: string): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const result = await CarModel.deleteOne({ _id: id, sellerId });
      if (!result.deletedCount) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      void FavoriteService.deleteForCar(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async deleteForSeller(sellerId: string): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(sellerId))
        throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      await CarModel.deleteMany({ sellerId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async listForAdmin(
    page = 1,
    pageSize = 30,
  ): Promise<{ items: unknown[]; total: number; page: number; pages: number }> {
    try {
      const currentPage = Math.max(1, Math.floor(page));
      const [items, total] = await Promise.all([
        CarModel.find()
          .sort({ createdAt: -1 })
          .skip((currentPage - 1) * pageSize)
          .limit(pageSize)
          .populate("sellerId", "name email phone")
          .lean(),
        CarModel.countDocuments(),
      ]);
      return {
        items,
        total,
        page: currentPage,
        pages: Math.max(1, Math.ceil(total / pageSize)),
      };
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async moderate(
    id: string,
    status: CarStatus.ACTIVE | CarStatus.REJECTED,
  ): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const result = await CarModel.updateOne(
        { _id: id, status: CarStatus.PENDING },
        { $set: { status } },
      );
      if (!result.modifiedCount) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async setAdminStatus(id: string, status: CarStatus): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const result = await CarModel.updateOne(
        { _id: id },
        { $set: { status } },
      );
      if (!result.matchedCount) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async deleteForAdmin(id: string): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const result = await CarModel.deleteOne({ _id: id });
      if (!result.deletedCount) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      void FavoriteService.deleteForCar(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
}
