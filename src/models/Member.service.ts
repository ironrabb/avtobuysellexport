import mongoose from "mongoose";
import MemberModel from "../schema/Member.model";
import bcrypt from "bcryptjs";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import type { MemberInput } from "../libs/types/member";
import { AppError, HttpCode } from "../libs/utils/Errors";
import { AuthService } from "./Auth.service";

export class MemberService {
  static async register(input: MemberInput): Promise<Record<string, unknown>> {
    try {
      const passwordHash = await bcrypt.hash(input.password, 12);
      const member = await MemberModel.create({
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        type: input.type ?? MemberType.BUYER,
      });
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        type: member.type,
        status: member.status,
        avatarUrl: member.avatarUrl ?? "",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof mongoose.Error.ValidationError)
        throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      if ((error as { code?: number }).code === 11000)
        throw new AppError("CONFLICT", HttpCode.CONFLICT);
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async authenticate(
    email: string,
    password: string,
  ): Promise<Record<string, unknown>> {
    try {
      const member = await MemberModel.findOne({
        email: email.toLowerCase(),
      }).select("+passwordHash");
      if (!member || !(await bcrypt.compare(password, member.passwordHash)))
        throw new AppError("BAD_CREDENTIALS", HttpCode.UNAUTHORIZED);
      if (member.status !== MemberStatus.ACTIVE)
        throw new AppError("ACCOUNT_SUSPENDED", HttpCode.FORBIDDEN, { status: member.status });
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        type: member.type,
        status: member.status,
        avatarUrl: member.avatarUrl ?? "",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async getProfile(memberId: string): Promise<Record<string, unknown>> {
    try {
      const member = (await MemberModel.findById(memberId)
        .select("-passwordHash")
        .lean()) as unknown as { _id: unknown; [key: string]: unknown } | null;
      if (!member) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      return { ...member, id: String(member._id), _id: undefined };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async isActiveAdmin(memberId: string): Promise<boolean> {
    try {
      const member = (await MemberModel.findById(memberId)
        .select("type status")
        .lean()) as unknown as { type?: string; status?: string } | null;
      return (
        member?.type === MemberType.ADMIN &&
        member.status === MemberStatus.ACTIVE
      );
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async isActiveSeller(memberId: string): Promise<boolean> {
    try {
      const member = (await MemberModel.findById(memberId)
        .select("type status")
        .lean()) as unknown as { type?: string; status?: string } | null;
      return (
        member?.status === MemberStatus.ACTIVE &&
        (member.type === MemberType.SELLER || member.type === MemberType.ADMIN)
      );
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async getStatus(memberId: string): Promise<MemberStatus | null> {
    try {
      if (!mongoose.isValidObjectId(memberId)) return null;
      const member = (await MemberModel.findById(memberId)
        .select("status")
        .lean()) as unknown as { status?: MemberStatus } | null;
      return member?.status ?? null;
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async setAvatar(
    memberId: string,
    avatarUrl: string,
  ): Promise<Record<string, unknown>> {
    try {
      const member = (await MemberModel.findByIdAndUpdate(
        memberId,
        { $set: { avatarUrl } },
        { new: true, runValidators: true },
      )
        .select("-passwordHash")
        .lean()) as unknown as { _id: unknown; [key: string]: unknown } | null;
      if (!member) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      return { ...member, id: String(member._id), _id: undefined };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async assertDeletableByAdmin(memberId: string): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(memberId))
        throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const member = await MemberModel.findOne({
        _id: memberId,
        type: { $ne: MemberType.ADMIN },
      }).select("_id");
      if (!member) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async deleteForAdmin(memberId: string): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(memberId))
        throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      await AuthService.revokeAllForMember(memberId);
      const result = await MemberModel.deleteOne({
        _id: memberId,
        type: { $ne: MemberType.ADMIN },
      });
      if (!result.deletedCount) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async listForAdmin(
    page = 1,
    pageSize = 30,
  ): Promise<{
    items: Array<Record<string, unknown>>;
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const currentPage = Math.max(1, Math.floor(page));
      const [members, total] = await Promise.all([
        MemberModel.find()
          .select("-passwordHash")
          .sort({ createdAt: -1 })
          .skip((currentPage - 1) * pageSize)
          .limit(pageSize)
          .lean(),
        MemberModel.countDocuments(),
      ]);
      return {
        items: members.map((member) => ({ ...member, id: String(member._id) })),
        total,
        page: currentPage,
        pages: Math.max(1, Math.ceil(total / pageSize)),
      };
    } catch {
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
  static async setAdminStatus(
    memberId: string,
    status: MemberStatus,
  ): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(memberId))
        throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      const member = await MemberModel.findOne({
        _id: memberId,
        type: { $ne: MemberType.ADMIN },
      }).select("_id status");
      if (!member) throw new AppError("NOT_FOUND", HttpCode.NOT_FOUND);
      member.status = status;
      await member.save();
      if (status !== MemberStatus.ACTIVE)
        await AuthService.revokeAllForMember(memberId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof mongoose.Error.ValidationError)
        throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      throw new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    }
  }
}
