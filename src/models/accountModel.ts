import mongoose from 'mongoose'

export interface IAccount {
  _id?: mongoose.Schema.Types.ObjectId
  email: string
  password: string
  name: string
  image?: string
  refreshTokens?: string[]
  posts: mongoose.Schema.Types.ObjectId[]
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
      type: mongoose.Types.ObjectId,
      ref: 'userPost',
    },
  ],
})

export default mongoose.model<IAccount>('account', accountSchema)
