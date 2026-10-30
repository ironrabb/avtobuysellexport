import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { MemberStatus, MemberType } from '../libs/enums/member.enum';
import type { MemberInput } from '../libs/types/member';
import { AppError } from '../libs/utils/Errors';

const memberSchema = new Schema({ name: { type: String, required: true, trim: true, maxlength: 100 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, phone: { type: String, required: true, unique: true, trim: true }, passwordHash: { type: String, required: true, select: false }, type: { type: String, enum: Object.values(MemberType), default: MemberType.BUYER }, status: { type: String, enum: Object.values(MemberStatus), default: MemberStatus.ACTIVE } }, { timestamps: true });
const MemberModel = mongoose.models.Member ?? mongoose.model('Member', memberSchema);

export class MemberService {
  static async register(input: MemberInput): Promise<Record<string, unknown>> {
    try {
      const passwordHash = await bcrypt.hash(input.password, 12);
      const member = await MemberModel.create({ name: input.name, email: input.email, phone: input.phone, passwordHash, type: input.type ?? MemberType.BUYER });
      return { id: member.id, name: member.name, email: member.email, phone: member.phone, type: member.type, status: member.status };
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof mongoose.Error.ValidationError) throw new AppError('VALIDATION', 400);
      if ((error as { code?: number }).code === 11000) throw new AppError('CONFLICT', 409);
      throw new AppError('INTERNAL', 500);
    }
  }
  static async authenticate(email: string, password: string): Promise<Record<string, unknown>> {
    try {
      const member = await MemberModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      if (!member || !(await bcrypt.compare(password, member.passwordHash))) throw new AppError('BAD_CREDENTIALS', 401);
      if (member.status !== MemberStatus.ACTIVE) throw new AppError('FORBIDDEN', 403);
      return { id: member.id, name: member.name, email: member.email, phone: member.phone, type: member.type };
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('INTERNAL', 500); }
  }
  static async getProfile(memberId: string): Promise<Record<string, unknown>> {
    try {
      const member = await MemberModel.findById(memberId).select('-passwordHash').lean();
      if (!member) throw new AppError('NOT_FOUND', 404);
      return { ...member, id: String(member._id), _id: undefined };
    } catch (error) { if (error instanceof AppError) throw error; throw new AppError('INTERNAL', 500); }
  }
  static async isActiveAdmin(memberId: string): Promise<boolean> {
    try {
      const member = await MemberModel.findById(memberId).select('type status').lean();
      return member?.type === MemberType.ADMIN && member.status === MemberStatus.ACTIVE;
    } catch { throw new AppError('INTERNAL', 500); }
  }
  static async isActiveSeller(memberId: string): Promise<boolean> {
    try {
      const member = await MemberModel.findById(memberId).select('type status').lean();
      return member?.status === MemberStatus.ACTIVE && (member.type === MemberType.SELLER || member.type === MemberType.ADMIN);
    } catch { throw new AppError('INTERNAL', 500); }
  }
}
