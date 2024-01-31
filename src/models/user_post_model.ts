import mongoose from 'mongoose'

export interface IUserPost {
  owner: mongoose.Schema.Types.ObjectId
  title: string
  message: string
}

const userPostSchema = new mongoose.Schema<IUserPost>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})

export default mongoose.model<IUserPost>('userPost', userPostSchema)
