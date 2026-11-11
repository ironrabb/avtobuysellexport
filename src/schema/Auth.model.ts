import mongoose, { Schema } from "mongoose";

const authSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const AuthRecord =
  mongoose.models.AuthRecord ?? mongoose.model("AuthRecord", authSchema);

export default AuthRecord;
