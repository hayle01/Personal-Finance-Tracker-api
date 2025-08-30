import express from "express";
import { overview } from "../controllers/admin.js";
import { protect } from '../middlewares/Auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

router.get("/overview", protect, authorize('admin'), overview);


export default router