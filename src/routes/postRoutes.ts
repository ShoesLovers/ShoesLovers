import express from "express";
import PostController from "../controllers/postController";
import authMiddleware from "../controllers/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Post
 *  description: The Post API
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
 *   PostSchema:
 *    type: object
 *    required:
 *     - title
 *     - message
 *    properties:
 *     title:
 *      type: string
 *      description: The Post title
 *     message:
 *      type: string
 *      description: The Post text
 *    example:
 *     title: Omer Ben Arieh Post's
 *     message: my name is omer
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get All Posts
 *     tags: [Post]
 *     description: Retrieve all posts from the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'  # Reference to the Post schema
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, token is valid but does not have sufficient permissions
 *       404:
 *         description: No posts found
 */
router.get("/", authMiddleware, PostController.getAll.bind(PostController));
/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get Post by ID
 *     tags: [Post]
 *     description: Retrieve a single post by its ID from the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to the Post schema
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Post not found
 */
router.get("/:id", authMiddleware, PostController.getById.bind(PostController));

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a Post
 *     tags: [Post]
 *     description: Create a new post in the DB
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostSchema'  # Reference to the PostSchema for post input data
 *     responses:
 *       201:
 *         description: Successfully created the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to the Post schema
 *       400:
 *         description: Bad request, invalid input data
 *       401:
 *         description: Unauthorized, token is missing or invalid
 */
router.post("/", authMiddleware, PostController.post.bind(PostController));

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a Post by ID
 *     tags: [Post]
 *     description: Update an existing post in the DB by its ID
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'  # Reference to the schema for post input data
 *     responses:
 *       200:
 *         description: Successfully updated the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to the schema for the updated post
 *       400:
 *         description: Bad request, invalid input data
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Post not found
 */

router.put(
  "/:id",
  authMiddleware,
  PostController.updateById.bind(PostController)
);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a Post by ID
 *     tags: [Post]
 *     description: Delete an existing post from the DB by its ID
 *     security:
 *       - bearerAuth: []  # Use bearer token authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the post
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Post not found
 */
router.delete(
  "/:id",
  authMiddleware,
  PostController.deleteById.bind(PostController)
);

export default router;
