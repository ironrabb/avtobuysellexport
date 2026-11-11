import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ memberId: 1, carId: 1 }, { unique: true });

const FavoriteModel =
  mongoose.models.Favorite ?? mongoose.model("Favorite", favoriteSchema);

export default FavoriteModel;
