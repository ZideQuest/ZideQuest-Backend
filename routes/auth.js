import { Router } from "express";
import { login, test } from "../controller/auth.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.js"
const router = Router()


router.post("/login", login)
router.get("/", verifyUser, test)

export default router