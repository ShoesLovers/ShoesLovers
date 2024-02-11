import mongoose from 'mongoose'

interface IComment {
  _id?: string
  content: string
  writer?: mongoose.Schema.Types.ObjectId
  postId?: string
}

const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: true,
  },
  writer: {
    type: mongoose.Types.ObjectId,
    ref: 'account',
    required: true,
  },
  postId: {
    type: String,
    ref: 'post',
    required: true,
  },
})

const commentModel = mongoose.model<IComment>('comment', commentSchema)

export { commentModel, IComment }
