import express from 'express'
import commentController from '../controllers/commentController'
import authMiddleware from '../controllers/auth_middleware'

const router = express.Router()

router.get('/', commentController.getAll.bind(commentController))
router.get('/:id', commentController.getById.bind(commentController))

router.post(
  '/:id',
  authMiddleware,
  commentController.post.bind(commentController)
)

router.put(
  '/:id',
  authMiddleware,
  commentController.updateById.bind(commentController)
)

router.delete(
  '/:id',
  authMiddleware,
  commentController.deleteById.bind(commentController)
)

export default router
