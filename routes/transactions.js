import express from "express";
import { protect } from "../middlewares/Auth.js";
import { validateZod } from "../middlewares/validateZod.js";
import { createTransaction, deleteTransaction, getAllTransactions, summury, UpdateTransaction } from "../controllers/transactionsConroller.js";
import { createTransactionSchema } from "../schema/transactionsSchemas.js";
const router = express.Router();

router.post('/', protect, validateZod(createTransactionSchema), createTransaction)
router.get('/', protect, getAllTransactions);
router.put('/:id', protect, UpdateTransaction);
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
router.get('/monthly-summary', protect, summury);
export default router;