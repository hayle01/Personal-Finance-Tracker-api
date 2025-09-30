import express from "express";
import { protect } from "../middlewares/Auth.js";
import { validateZod } from "../middlewares/validateZod.js";
import { createTransaction, deleteTransaction, getAllTransactions, getLatestTransactions, summaryByPeriod, UpdateTransaction } from "../controllers/transactionsConroller.js";
import { createTransactionSchema } from "../schema/transactionsSchemas.js";
const router = express.Router();
/**
 * @swagger
 * /transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     description: Creates a transaction for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery shopping
 *               amount:
 *                 type: number
 *                 example: 50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-30T12:00:00.000Z
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b1f8a166bfbfe09f676672
 *                     title:
 *                       type: string
 *                       example: Grocery shopping
 *                     amount:
 *                       type: number
 *                       example: 50
 *                     type:
 *                       type: string
 *                       enum: [income, expense]
 *                       example: expense
 *                     category:
 *                       type: string
 *                       example: Food
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-30T12:00:00.000Z
 *                     createdBy:
 *                       type: string
 *                       example: 68b1e7f8ac63e04c70a77ee7
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-30T12:05:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-30T12:05:00.000Z
 *       401:
 *         description: Unauthorized – user not logged in
 *       500:
 *         description: Server error
 */
router.post('/', protect, validateZod(createTransactionSchema), createTransaction)
/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get all transactions
 *     description: Returns all transactions created by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 68b1f8a166bfbfe09f676672
 *                   title:
 *                     type: string
 *                     example: Grocery shopping
 *                   amount:
 *                     type: number
 *                     example: -50
 *                   type:
 *                     type: string
 *                     enum: [income, expense]
 *                     example: expense
 *                   category:
 *                     type: string
 *                     example: Food
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-08-28T21:00:00.000Z
 *                   createdBy:
 *                     type: string
 *                     example: 68b1e7f8ac63e04c70a77ee7
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-08-29T18:59:45.954Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-08-30T09:50:49.706Z
 *       401:
 *         description: Unauthorized – user not logged in
 *       500:
 *         description: Server error
 */
router.get('/', protect, getAllTransactions);
router.get('/latest', protect, getLatestTransactions);
/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     tags:
 *       - Transactions
 *     summary: Update a transaction
 *     description: Allows the owner of a transaction to update its details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery shopping
 *               amount:
 *                 type: number
 *                 example: 75.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-28T21:00:00.000Z
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 68b1f8a166bfbfe09f676672
 *                 title:
 *                   type: string
 *                   example: Grocery shopping
 *                 amount:
 *                   type: number
 *                   example: 75.50
 *                 type:
 *                   type: string
 *                   enum: [income, expense]
 *                   example: expense
 *                 category:
 *                   type: string
 *                   example: Food
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-28T21:00:00.000Z
 *                 createdBy:
 *                   type: string
 *                   example: 68b1e7f8ac63e04c70a77ee7
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-29T18:59:45.954Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-30T09:50:49.706Z
 *       401:
 *         description: Unauthorized – user not logged in
 *       403:
 *         description: Forbidden – not the owner of the transaction
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, UpdateTransaction);
/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     tags:
 *       - Transactions
 *     summary: Delete a transaction
 *     description: Deletes a transaction by its ID. Only the user who created the transaction can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to delete
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       401:
 *         description: Unauthorized – user not logged in or invalid token
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, deleteTransaction);
/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get monthly summary of transactions
 *     description: Returns total spent and earned per category for a given month. Only transactions for the authenticated user are included.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12) for the summary. Defaults to current month.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for the summary. Defaults to current year.
 *     responses:
 *       200:
 *         description: Monthly summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Food
 *                       totalSpent:
 *                         type: number
 *                         example: 250
 *                       totalEarned:
 *                         type: number
 *                         example: 0
 *       401:
 *         description: Unauthorized – user not logged in or invalid token
 *       500:
 *         description: Server error
 */
router.get("/summary", protect, summaryByPeriod);
export default router;