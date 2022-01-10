import { model, models, Schema } from "mongoose";
const warnSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
    },
    warnings: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const warnModel = models.warn || model("warn", warnSchema);
