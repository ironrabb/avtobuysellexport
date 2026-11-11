import mongoose from "mongoose";
import FavoriteModel from "../schema/Favorite.model";
import CarModel from "../schema/Car.model";
import { CarStatus } from "../libs/enums/car.enum";
import { AppError } from "../libs/utils/Errors";

export class FavoriteService {
  static async toggle(
    memberId: string,
    carId: string,
  ): Promise<{ isFavorite: boolean }> {
    try {
      if (!mongoose.isValidObjectId(carId)) {
        throw new AppError("NOT_FOUND", 404);
      }

      const car = await CarModel.findOne({
        _id: carId,
        status: CarStatus.ACTIVE,
      }).select("_id");
      if (!car) {
        throw new AppError("NOT_FOUND", 404);
      }

      const existing = await FavoriteModel.findOne({ memberId, carId });
      if (existing) {
        await FavoriteModel.deleteOne({ _id: existing._id });
        return { isFavorite: false };
      }

      await FavoriteModel.create({ memberId, carId });
      return { isFavorite: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", 500);
    }
  }

  static async listByMember(memberId: string): Promise<unknown[]> {
    try {
      const favorites = await FavoriteModel.find({ memberId })
        .sort({ createdAt: -1 })
        .populate({
          path: "carId",
          match: { status: CarStatus.ACTIVE },
          populate: { path: "sellerId", select: "name phone avatarUrl" },
        })
        .lean();

      return favorites
        .filter((item) => item.carId != null)
        .map((item) => item.carId);
    } catch {
      throw new AppError("INTERNAL", 500);
    }
  }

  static async getFavoriteCarIds(memberId: string): Promise<string[]> {
    try {
      const favorites = await FavoriteModel.find({ memberId })
        .select("carId")
        .lean();
      return favorites.map((item) => String(item.carId));
    } catch {
      throw new AppError("INTERNAL", 500);
    }
  }

  static async deleteForCar(carId: string): Promise<void> {
    try {
      await FavoriteModel.deleteMany({ carId });
    } catch {
      // Background cleanup, suppress
    }
  }
}
