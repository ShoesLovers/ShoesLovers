import express from 'express'
import UserPostController from '../controllers/postController'
import authMiddleware from '../controllers/auth_middleware'

const router = express.Router()

router.get('/', UserPostController.getAll.bind(UserPostController))
router.get('/:id', UserPostController.getById.bind(UserPostController))

router.post(
  '/',
  authMiddleware,
  UserPostController.post.bind(UserPostController)
)

router.put(
  '/:id',
  authMiddleware,
  UserPostController.updateById.bind(UserPostController)
)

router.delete(
  '/:id',
  authMiddleware,
  UserPostController.deleteById.bind(UserPostController)
)

export default router
