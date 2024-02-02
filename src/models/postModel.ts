import mongoose, { Schema } from 'mongoose'

export interface IPost<T = mongoose.Schema.Types.ObjectId> {
  owner: T
  title: string
  message: string
  comments: T[]
}

const userPostSchema = new mongoose.Schema<IPost>({
  owner: {
    type: Schema.Types.Mixed,
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
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'comment',
    },
  ],
})

export default mongoose.model<IPost>('userPost', userPostSchema)
