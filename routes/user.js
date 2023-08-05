import { Router } from "express";;
import { createUser, deleteUserById, getUser, getUserActivity, getUserById, getUserQuest, updateUserById } from "../controller/user.js";

const router = Router()

router.get("/find", getUser)
router.get("/find/:id", getUserById)
router.get("/quest/:id", getUserQuest)
router.get("/activity/:id", getUserActivity)

router.post("/", createUser)
router.delete("/:id", deleteUserById)
router.put("/:id", updateUserById)




export default router