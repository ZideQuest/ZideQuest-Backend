import { Router } from "express";;
import { createUser, deleteUserById, getUser, getUserActivity, getUserById, getUserInfo, getUserQuest, updateUserById } from "../controller/user.js";
import { upload } from "../middleware/uploadImg.js";
import { verifyUser } from "../middleware/auth.js";

const router = Router()

router.get("/find", getUser)
router.get("/find/:id", getUserById)
router.get("/quest", verifyUser, getUserQuest)
router.get("/activity", verifyUser, getUserActivity)
router.get("/info", verifyUser, getUserInfo)

router.post("/", upload.single('igmg'), createUser)
router.delete("/:id", deleteUserById)
router.put("/:id", upload.single("img"), updateUserById)




export default router