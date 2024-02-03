import mongoose from 'mongoose'

interface IComment {
  content: string
  writer?: mongoose.Schema.Types.ObjectId
  postId?: mongoose.Schema.Types.ObjectId | string
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
    type: mongoose.Types.ObjectId,
    ref: 'userPost',
    required: true,
  },
})

const commentModel = mongoose.model<IComment>('comment', commentSchema)

export { commentModel, IComment }
