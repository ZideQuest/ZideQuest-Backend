import { Router } from "express";;
import { createAdmin } from "../controller/admin.js";

const router = Router()

router.post("/", createAdmin)

export default router