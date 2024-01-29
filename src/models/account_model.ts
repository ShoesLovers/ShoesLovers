import mongoose from "mongoose";

export interface IAccount {
  email: string;
  password: string;
  _id?: string;
  refreshTokens?: string[];
}
const accountSchema = new mongoose.Schema<IAccount>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IAccount>("account", accountSchema);
