import { model, models, Schema } from "mongoose";
const logsSchema = new Schema(
  {
    channelId: { type: String, required: true, unique: true },
    enabled: { type: Boolean, required: false },
    guildId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export const logs = models.logs || model("logs", logsSchema);
