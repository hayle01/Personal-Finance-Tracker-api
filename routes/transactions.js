import express from "express";
import { protect } from "../middlewares/Auth.js";
import { validateZod } from "../middlewares/validateZod.js";
import { createTransaction, getAllTransactions, UpdateTransaction } from "../controllers/transactionsConroller.js";
import { createTransactionSchema } from "../schema/transactionsSchemas.js";
const router = express.Router();

router.post('/', protect, validateZod(createTransactionSchema), createTransaction)
router.get('/', protect, getAllTransactions);
router.put('/:id', protect, UpdateTransaction);
export default router;