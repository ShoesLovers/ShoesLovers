import mongoose from "mongoose";

export interface IUser {
  name: string;
  _id: string;
}
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
  },
});

export default mongoose.model<IUser>("user", userSchema);
