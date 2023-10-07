import { Router } from "express";;
import { createUser, deleteUserById, deleteUserNoti, getUser, getUserActivity, getUserById, getUserInfo, getUserQuest, updateUserById } from "../controller/user.js";
import { upload } from "../middleware/uploadImg.js";
import { verifyUser } from "../middleware/auth.js";

const router = Router()

router.get("/", getUser)
router.get("/:id/find", getUserById)
router.get("/quests", verifyUser, getUserQuest)
router.get("/activity", verifyUser, getUserActivity)
router.get("/info", verifyUser, getUserInfo)

router.post("/", upload.single('img'), createUser)
router.put("/:id", upload.single("img"), updateUserById)
router.delete("/:id", deleteUserById)
router.delete("/notification/:notiId", verifyUser, deleteUserNoti)




export default router