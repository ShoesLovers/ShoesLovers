import mongoose from 'mongoose';

export interface IAccount {
  _id?: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  name?: string;
  image?: string;
  refreshTokens?: string[];
  posts: string[];
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
  name: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  posts: [
    {
      type: String,
      ref: 'post',
    },
  ],
  image: {
    type: String,
    required: false,
  },
});

export default mongoose.model<IAccount>('account', accountSchema);
