import { Router } from "express";;
import { createAccount, getAccount } from "../controller/account.js";

const router = Router()

router.get("/", getAccount)
router.post("/", createAccount)

export default router