import { CarStatus, Fuel, Region, Transmission } from '../enums/car.enum';
export interface CarInput { title: string; make: string; model: string; year: number; price: number; mileage: number; transmission: Transmission; fuel: Fuel; region: Region; description?: string; images?: string[]; }
export interface CarDocument extends CarInput { _id: string; sellerId: string; status: CarStatus; createdAt: Date; updatedAt: Date; }
