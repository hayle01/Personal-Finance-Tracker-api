import express from "express";
import { protect } from "../middlewares/Auth.js";
import { validateZod } from "../middlewares/validateZod.js";
import { createTransaction } from "../controllers/transactionsConroller.js";
import { createTransactionSchema } from "../schema/transactionsSchemas.js";
const router = express.Router();

router.post('/', protect, validateZod(createTransactionSchema), createTransaction)

export default router;