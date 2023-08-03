import { Router } from "express";;
import { createQuest, deleteQuestById, getQuest, getQuestById, getQuestParticipantsById, joinOrLeaveQuest, questComplete, recommendQuest, updateQuestById } from "../controller/quest.js";
import { verifyCreator, verifyUser } from "../middleware/auth.js";
import { upload } from "../middleware/uploadImg.js";

const router = Router()

router.get("/find", getQuest)
router.get("/find/:id", getQuestById)
router.get("/participants/:id", getQuestParticipantsById)
router.get("/recommend", recommendQuest)

router.post("/location/:locationId", verifyCreator, upload.single('img'), createQuest)
router.post("/complete/:id", verifyCreator, questComplete)

router.put("/find/:id", verifyCreator, updateQuestById)
router.put("/join-leave/:id", verifyUser, joinOrLeaveQuest)

router.delete("/:id", verifyCreator, deleteQuestById)



export default router