import mongoose from 'mongoose'

export interface IAccount {
  email: string
  password: string
  name: string
  refreshTokens?: string[]
  posts?: mongoose.Schema.Types.ObjectId[]
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
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'userPost',
    required: false,
  },
})

export default mongoose.model<IAccount>('account', accountSchema)
