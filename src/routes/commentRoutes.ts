import express from 'express'
import commentController from '../controllers/commentController'
import authMiddleware from '../controllers/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Comment
 *  description: The Comment API
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
 * components:
 *  schemas:
 *   CommentSchema:
 *    type: object
 *    required:
 *     - content
 *    properties:
 *     title:
 *      type: string
 *      description: The Comment content
 *    example:
 *     content: This is Content
 */

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get All Comments
 *     tags: [Comment]
 *     description: Retrieve all comments from the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommentSchema'
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: No comments found
 */
router.get('/', commentController.getAll.bind(commentController))

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get Comment by ID
 *     tags: [Comment]
 *     description: Retrieve a single comment by its ID from the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentSchema'
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Comment not found
 */
router.get('/:id', commentController.getById.bind(commentController))

/**
 * @swagger
 * /comment/{postId}:
 *   post:
 *     summary: Create a Comment for a Post
 *     tags: [Comment]
 *     description: Create a new comment for a specific post in the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to which the comment belongs
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentSchema'
 *     responses:
 *       201:
 *         description: Successfully created the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentSchema'
 *       400:
 *         description: Bad request, invalid input data
 *       401:
 *         description: Unauthorized, token is missing or invalid
 */
router.post(
  '/:id',
  authMiddleware,
  commentController.post.bind(commentController)
)

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update a Comment by ID
 *     tags: [Comment]
 *     description: Update an existing comment in the DB by its ID
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentSchema'
 *     responses:
 *       200:
 *         description: Successfully updated the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentSchema'
 *       400:
 *         description: Bad request, invalid input data
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Comment not found
 */
router.put(
  '/:id',
  authMiddleware,
  commentController.updateById.bind(commentController)
)

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a Comment by ID
 *     tags: [Comment]
 *     description: Delete an existing comment from the DB by its ID
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the comment
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Comment not found
 */
router.delete(
  '/:id',
  authMiddleware,
  commentController.deleteById.bind(commentController)
)

export default router
