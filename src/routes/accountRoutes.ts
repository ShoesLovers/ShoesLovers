import express from 'express'
import AccountController from '../controllers/accountController'
import authMiddleware from '../controllers/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Account
 *  description: The Account API
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 */

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get All Accounts
 *     tags: [Account]
 *     description: Get All Accounts from the DB. (You should login first to get the access token and include it in the request header)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got all accounts successfully
 */
router.get(
  '/',
  authMiddleware,
  AccountController.getAll.bind(AccountController)
)

/**
 * @swagger
 * /account/{id}:
 *  get:
 *    summary: Get Account by ID
 *    tags: [Account]
 *    description: Get a single account from the DB by including the access token in the header request and adding the ID of the account to the route
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the account to retrieve
 *        schema:
 *          type: string
 *    responses:
 *       200:
 *        description: Got the Account successfully
 */
router.get(
  '/:id',
  authMiddleware,
  AccountController.getById.bind(AccountController)
)

/**
 * @swagger
 * /account/{id}:
 *  put:
 *    summary: Update Account by ID
 *    tags: [Account]
 *    description: Update an account in the DB by including the access token in the header request and adding the ID of the account to the route
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the account to update
 *        schema:
 *          type: string
 *      - in: body
 *        name: account
 *        description: Account object containing the updated information
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: The updated name of the account
 *            email:
 *              type: string
 *              description: The updated email of the account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account' # Reference to the Account schema
 *    responses:
 *       200:
 *        description: Account updated successfully
 *       404:
 *        description: Account not found
 */

router.put(
  '/:id',
  authMiddleware,
  AccountController.updateById.bind(AccountController)
)

/**
 * @swagger
 * /account/{id}:
 *  delete:
 *    summary: Delete Account by ID
 *    tags: [Account]
 *    description: Delete an account from the DB by including the access token in the header request and adding the ID of the account to the route
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the account to delete
 *        schema:
 *          type: string
 *    responses:
 *       204:
 *        description: Account deleted successfully
 *       404:
 *        description: Account not found
 */

router.delete(
  '/:id',
  authMiddleware,
  AccountController.deleteById.bind(AccountController)
)

/**
 * @swagger
 * /account/posts/{id}:
 *   get:
 *     summary: Get Posts of an Account by ID
 *     tags: [Account]
 *     description: Get posts of an account from the DB by including the access token in the header request and adding the ID of the account to the route
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the account to get posts for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved posts of the account
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'  # Reference to the Post schema
 *       404:
 *         description: Account not found or no posts found for the account
 */
router.get(
  '/posts/:id',
  authMiddleware,
  AccountController.getPostsOfAccount.bind(AccountController)
)

export default router
