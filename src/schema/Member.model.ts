import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

const memberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    type: {
      type: String,
      enum: Object.values(MemberType),
      default: MemberType.BUYER,
    },
    status: {
      type: String,
      enum: Object.values(MemberStatus),
      default: MemberStatus.ACTIVE,
    },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

const MemberModel =
  (mongoose.models.Member as mongoose.Model<any> | undefined) ??
  mongoose.model<any>("Member", memberSchema);

export default MemberModel;
