import mongoose from "mongoose";
import AuthRecord from "../schema/Auth.model";
import jwt from "jsonwebtoken";
import { createHmac } from "node:crypto";
import { config } from "../libs/utils/config";
import { AppError, HttpCode } from "../libs/utils/Errors";

export class AuthService {
  static async create(
    memberId: string,
  ): Promise<{ token: string; sessionId: string }> {
    try {
      const sessionId = new mongoose.Types.ObjectId().toString();
      const token = jwt.sign(
        { sub: memberId, sid: sessionId },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"] },
      );
      const tokenHash = createHmac("sha256", config.sessionSecret)
        .update(token)
        .digest("hex");
      const expiresAt = new Date(Date.now() + config.sessionTtlDays * 86400000);
      await AuthRecord.create({
        _id: sessionId,
        memberId,
        tokenHash,
        expiresAt,
      });
      return { token, sessionId };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async identify(
    token: string,
  ): Promise<{ memberId: string; sessionId: string }> {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
      if (!payload.sub || !payload.sid) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      return { memberId: String(payload.sub), sessionId: String(payload.sid) };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    }
  }
  static async verify(
    token: string,
  ): Promise<{ memberId: string; sessionId: string }> {
    try {
      const payload = await AuthService.identify(token);
      const tokenHash = createHmac("sha256", config.sessionSecret)
        .update(token)
        .digest("hex");
      const record = await AuthRecord.findOne({
        _id: payload.sessionId,
        memberId: payload.memberId,
        tokenHash,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      }).lean();
      if (!record) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
      return payload;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    }
  }
  static async revoke(sessionId: string): Promise<void> {
    try {
      await AuthRecord.updateOne(
        { _id: sessionId, revokedAt: null },
        { $set: { revokedAt: new Date() } },
      );
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async revokeAllForMember(memberId: string): Promise<void> {
    try {
      await AuthRecord.updateMany(
        { memberId, revokedAt: null },
        { $set: { revokedAt: new Date() } },
      );
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
}
