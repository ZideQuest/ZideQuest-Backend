import { Router } from "express";;
import { createUser, deleteUserById, getUser, getUserActivity, getUserById, getUserQuest, updateUserById } from "../controller/user.js";
import { upload } from "../middleware/uploadImg.js";

const router = Router()

router.get("/find", getUser)
router.get("/find/:id", getUserById)
router.get("/quest/:id", getUserQuest)
router.get("/activity/:id", getUserActivity)

router.post("/", upload.single('igmg'), createUser)
router.delete("/:id", deleteUserById)
router.put("/:id", upload.single("img"), updateUserById)




export default router