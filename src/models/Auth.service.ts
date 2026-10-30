import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { createHmac } from 'node:crypto';
import { config } from '../libs/utils/config';
import { AppError } from '../libs/utils/Errors';

const authSchema = new Schema({ memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, revokedAt: { type: Date, default: null } }, { timestamps: true });
const AuthRecord = mongoose.models.AuthRecord ?? mongoose.model('AuthRecord', authSchema);

export class AuthService {
  static async create(memberId: string): Promise<{ token: string; sessionId: string }> {
    try {
      const sessionId = new mongoose.Types.ObjectId().toString();
      const token = jwt.sign({ sub: memberId, sid: sessionId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
      const tokenHash = createHmac('sha256', config.sessionSecret).update(token).digest('hex');
      const expiresAt = new Date(Date.now() + config.sessionTtlDays * 86400000);
      await AuthRecord.create({ _id: sessionId, memberId, tokenHash, expiresAt });
      return { token, sessionId };
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('INTERNAL', 500); }
  }
  static async verify(token: string): Promise<{ memberId: string; sessionId: string }> {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
      if (!payload.sub || !payload.sid) throw new AppError('UNAUTHORIZED', 401);
      const tokenHash = createHmac('sha256', config.sessionSecret).update(token).digest('hex');
      const record = await AuthRecord.findOne({ _id: payload.sid, memberId: payload.sub, tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } }).lean();
      if (!record) throw new AppError('UNAUTHORIZED', 401);
      return { memberId: String(payload.sub), sessionId: String(payload.sid) };
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('UNAUTHORIZED', 401); }
  }
  static async revoke(sessionId: string): Promise<void> {
    try { await AuthRecord.updateOne({ _id: sessionId, revokedAt: null }, { $set: { revokedAt: new Date() } }); }
    catch { throw new AppError('INTERNAL', 500); }
  }
}
