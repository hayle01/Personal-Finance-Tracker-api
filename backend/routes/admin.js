import express from "express";
import { overview } from "../controllers/admin.js";
import { protect } from '../middlewares/Auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();
/**
 * @swagger
 * /admin/overview:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get system overview (admin only)
 *     description: Returns total users, total transactions, total income, total expense, and top 5 spending categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 2
 *                 totalTransactions:
 *                   type: integer
 *                   example: 4
 *                 totalIncomes:
 *                   type: number
 *                   example: 600
 *                 totalExpenses:
 *                   type: number
 *                   example: 400
 *                 topSpendingCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: rent
 *                       totalSpent:
 *                         type: number
 *                         example: 200
 *       401:
 *         description: Unauthorized – user not logged in or invalid token
 *       403:
 *         description: Forbidden – user is not an admin
 *       500:
 *         description: Server error
 */
router.get("/overview", protect, authorize('admin'), overview);


export default router