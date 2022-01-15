import { model, models, Schema } from "mongoose";
const warnSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  warnings: {
    type: Array,
    required: true,
  },
});
export const warnModel = models.warning || model("warning", warnSchema);
