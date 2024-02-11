import mongoose from 'mongoose'

export interface IPost {
  _id?: string
  owner?: mongoose.Schema.Types.ObjectId
  title: string
  message: string
  comments?: string[]
}

const PostSchema = new mongoose.Schema<IPost>({
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
      type: String,
      ref: 'comment',
    },
  ],
})

export default mongoose.model<IPost>('post', PostSchema)
