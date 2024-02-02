import express from 'express'
import AccountController from '../controllers/account_controller'
import authMiddleware from '../controllers/auth_middleware'

const router = express.Router()

router.get(
  '/',
  authMiddleware,
  AccountController.getAll.bind(AccountController)
)
router.get(
  '/:id',
  authMiddleware,
  AccountController.getById.bind(AccountController)
)

router.put(
  '/:id',
  authMiddleware,
  AccountController.updateById.bind(AccountController)
)

router.delete(
  '/:id',
  authMiddleware,
  AccountController.deleteById.bind(AccountController)
)

router.get(
  '/posts/:id',
  authMiddleware,
  AccountController.getPostsOfAccount.bind(AccountController)
)

export default router
