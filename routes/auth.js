import express from "express";
import {validateZod} from '../middlewares/validateZod.js';
import {protect} from '../middlewares/Auth.js'
import {createUserSchema} from '../schema/userSchemas.js'
import { login, registerUser } from "../controllers/auth.js";
import {upload} from '../middlewares/upload.js'
import {updloadFile} from '../controllers/uploadController.js'
const router = express.Router();

router.post('/register', validateZod(createUserSchema), registerUser);
router.post('/login', login);
router.post('/profile', protect, upload.single('file'), updloadFile);

export default router;