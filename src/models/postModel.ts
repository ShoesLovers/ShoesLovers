import mongoose from 'mongoose'

export interface IPost {
  owner?: mongoose.Schema.Types.ObjectId
  title: string
  message: string
}

const userPostSchema = new mongoose.Schema<IPost>({
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

export default mongoose.model<IPost>('userPost', userPostSchema)
