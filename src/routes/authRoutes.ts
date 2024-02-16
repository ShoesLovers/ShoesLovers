import express from 'express'
import AuthController from '../controllers/authController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The Authentication API
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
 *   Account:
 *    type: object
 *    required:
 *     - email
 *     - name
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      description: The user email
 *     name:
 *      type: string
 *      description: The user name
 *     password:
 *      type: string
 *      description: The user password
 *    example:
 *     email: 'bob@gmail.com'
 *     name: 'Bob'
 *     password: '123456'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   LoginSchema:
 *    type: object
 *    required:
 *     - email
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      description: The user email
 *     password:
 *      type: string
 *      description: The user password
 *    example:
 *     email: 'bob@gmail.com'
 *     password: '123456'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */

router.post('/register', AuthController.register)
// router.post('/google', AuthController.googleLogin)
/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login a user in to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       200:
 *         description: The acess & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post('/login', AuthController.login)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout completed successfully
 */
router.post('/logout', AuthController.logout)

router.get('/refresh', AuthController.refresh)

export default router
