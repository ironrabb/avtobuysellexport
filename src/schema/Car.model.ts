import mongoose, { Schema } from "mongoose";
import { CarStatus, Fuel, Region, Transmission } from "../libs/enums/car.enum";

const carSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    price: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true, min: 0 },
    transmission: {
      type: String,
      enum: Object.values(Transmission),
      required: true,
    },
    fuel: { type: String, enum: Object.values(Fuel), required: true },
    region: { type: String, enum: Object.values(Region), required: true },
    description: { type: String, maxlength: 5000 },
    images: [{ type: String }],
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CarStatus),
      default: CarStatus.PENDING,
      index: true,
    },
  },
  { timestamps: true },
);
carSchema.index({
  make: "text",
  model: "text",
  title: "text",
  description: "text",
});

const CarModel = mongoose.models.Car ?? mongoose.model("Car", carSchema);

export default CarModel;
