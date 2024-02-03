import mongoose from 'mongoose'

export interface IPost {
  _id?: mongoose.Schema.Types.ObjectId
  owner?: mongoose.Schema.Types.ObjectId
  title: string
  message: string
  comments: mongoose.Types.ObjectId[]
}

const userPostSchema = new mongoose.Schema<IPost>({
  owner: {
    type: mongoose.Types.ObjectId,
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
