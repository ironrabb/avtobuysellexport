import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { config } from "./config";
import { AppError, HttpCode } from "./Errors";

try {
  fs.mkdirSync(config.uploadDir, { recursive: true });
} catch {
  /* Papka keyin ishga tushishda yaratilishi mumkin. */
}
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, config.uploadDir),
  filename: (_request, file, callback) => {
    try {
      // Fayl nomi takrorlanmasligi va asl foydalanuvchi nomidan xavfsiz bo‘lishi uchun UUID ishlatiladi.
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    } catch (error) {
      callback(error as Error, "");
    }
  },
});
const uploader = multer({
  storage,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 10 },
  fileFilter: (_request, file, callback) => {
    try {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
        return callback(new AppError("VALIDATION", HttpCode.BAD_REQUEST));
      callback(null, true);
    } catch (error) {
      callback(error as Error);
    }
  },
});
export const uploadCarImages = uploader.array("images", 10);
export const uploadProfileImage = uploader.single("avatar");
