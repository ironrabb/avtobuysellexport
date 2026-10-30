import mongoose, { Schema } from 'mongoose';
import { CarStatus, Fuel, Region, Transmission } from '../libs/enums/car.enum';
import type { CarInput } from '../libs/types/car';
import { AppError } from '../libs/utils/Errors';

const carSchema = new Schema({ title: { type: String, required: true, trim: true, maxlength: 160 }, make: { type: String, required: true, trim: true }, model: { type: String, required: true, trim: true }, year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 }, price: { type: Number, required: true, min: 0 }, mileage: { type: Number, required: true, min: 0 }, transmission: { type: String, enum: Object.values(Transmission), required: true }, fuel: { type: String, enum: Object.values(Fuel), required: true }, region: { type: String, enum: Object.values(Region), required: true }, description: { type: String, maxlength: 5000 }, images: [{ type: String }], sellerId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true }, status: { type: String, enum: Object.values(CarStatus), default: CarStatus.PENDING, index: true } }, { timestamps: true });
carSchema.index({ make: 'text', model: 'text', title: 'text', description: 'text' });
const CarModel = mongoose.models.Car ?? mongoose.model('Car', carSchema);

export class CarService {
  static async create(input: CarInput, sellerId: string): Promise<Record<string, unknown>> {
    try {
      const car = await CarModel.create({ ...input, sellerId, status: CarStatus.PENDING });
      return car.toJSON();
    } catch (error) { if (error instanceof mongoose.Error.ValidationError) throw new AppError('VALIDATION', 400); throw new AppError('INTERNAL', 500); }
  }
  static async list(query: Record<string, unknown>): Promise<{ items: unknown[]; page: number; limit: number; total: number }> {
    try {
      const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
      const filter: Record<string, unknown> = { status: CarStatus.ACTIVE };
      if (typeof query.q === 'string' && query.q.trim()) filter.$text = { $search: query.q.trim() };
      for (const key of ['make', 'model', 'region', 'fuel', 'transmission']) if (typeof query[key] === 'string' && query[key]) filter[key] = query[key];
      if (query.minPrice || query.maxPrice) filter.price = { ...(query.minPrice ? { $gte: Number(query.minPrice) } : {}), ...(query.maxPrice ? { $lte: Number(query.maxPrice) } : {}) };
      const sortOrder = query.sort === 'cheap' ? { price: 1 as const } : query.sort === 'expensive' ? { price: -1 as const } : { createdAt: -1 as const };
      const [items, total] = await Promise.all([CarModel.find(filter).sort(sortOrder).skip((page - 1) * limit).limit(limit).lean(), CarModel.countDocuments(filter)]);
      return { items, page, limit, total };
    } catch { throw new AppError('INTERNAL', 500); }
  }
  static async getById(id: string): Promise<Record<string, unknown>> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError('NOT_FOUND', 404);
      const car = await CarModel.findOne({ _id: id, status: CarStatus.ACTIVE }).populate('sellerId', 'name phone').lean();
      if (!car) throw new AppError('NOT_FOUND', 404);
      return car as unknown as Record<string, unknown>;
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('INTERNAL', 500); }
  }
  static async listForAdmin(): Promise<unknown[]> {
    try { return await CarModel.find({ status: CarStatus.PENDING }).sort({ createdAt: 1 }).limit(100).populate('sellerId', 'name email phone').lean(); }
    catch { throw new AppError('INTERNAL', 500); }
  }
  static async moderate(id: string, status: CarStatus.ACTIVE | CarStatus.REJECTED): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(id)) throw new AppError('NOT_FOUND', 404);
      const result = await CarModel.updateOne({ _id: id, status: CarStatus.PENDING }, { $set: { status } });
      if (!result.modifiedCount) throw new AppError('NOT_FOUND', 404);
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('INTERNAL', 500); }
  }
}
