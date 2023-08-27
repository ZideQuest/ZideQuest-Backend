import { Router } from "express";;
import { createAccount, getAccount } from "../controller/account.js";

const router = Router()

/**
 * @swagger
 * /account:
 *   get:
 *     summary: account
 *     description: testing an API.
*/

router.get("/", getAccount)
router.post("/", createAccount)

export default router