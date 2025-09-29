import express from "express";
import {validateZod} from '../middlewares/validateZod.js';
import {protect} from '../middlewares/Auth.js'
import {createUserSchema} from '../schema/userSchemas.js'
import { getMe, login, registerUser } from "../controllers/auth.js";
import {upload} from '../middlewares/upload.js'
import {updloadFile} from '../controllers/uploadController.js'
const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account. Returns a JWT token on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               profile:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post('/register', validateZod(createUserSchema), registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticate a user with email and password. Returns a JWT token on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', login);
/**
 * @swagger
 * /auth/profile:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Upload user profile picture
 *     description: Allows the authenticated user to upload a profile picture. Returns the file URL.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 fileUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/.../Expense-tracker/profile.jpg
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized – user not logged in
 *       500:
 *         description: Server error
 */
router.post('/profile', protect, upload.single('file'), updloadFile);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current authenticated user
 *     description: Returns the profile information of the logged-in user. Requires a valid JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b1e7f8ac63e04c70a77ee7
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     profile:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: user
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-30T09:50:49.706Z
 *       401:
 *         description: Unauthorized – user not logged in
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', protect, getMe);
export default router;