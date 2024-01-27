import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
}
const userSchema = new mongoose.Schema<IUser>({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("user", userSchema);
