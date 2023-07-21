import { Router } from "express";;
import { createUser, deleteUserById, getUser, getUserById, updateUserById } from "../controller/user.js";

const router = Router()

router.post("/", createUser)
router.get("/", getUser)
router.get("/:id", getUserById)
router.delete("/:id", deleteUserById)
router.put("/:id", updateUserById)


export default router