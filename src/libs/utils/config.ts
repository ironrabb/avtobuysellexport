import dotenv from "dotenv";
import path from "node:path";
import mongoose from "mongoose";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Environment variable ${name} is required`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/avto_market"),
  jwtSecret: required("JWT_SECRET"),
  sessionSecret: required("SESSION_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS ?? 7),
  uploadDir: path.resolve(
    process.cwd(),
    process.env.UPLOAD_DIR ?? "src/public/images/uploads",
  ),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 5),
};

export const AUTH_TIMER = 24;
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
