import mongoose from 'mongoose'

export interface IAccount {
  email: string
  password: string
  name: string
  refreshTokens?: string[]
  posts: mongoose.Types.ObjectId[]
}

const accountSchema = new mongoose.Schema<IAccount>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    // select: false,
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
      type: mongoose.Types.ObjectId,
      ref: 'userPost',
    },
  ],
})

export default mongoose.model<IAccount>('account', accountSchema)
