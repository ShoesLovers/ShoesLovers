import mongoose from "mongoose";

export interface IAccount {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema<IAccount>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IAccount>("account", userSchema);
