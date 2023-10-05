import { Router } from "express";;
import { createQuest, deleteQuestById, getCreatorQuests, getQuest, getQuestById, getQuestParticipantsById, getUncompleteCreatorQuest, joinOrLeaveQuest, questComplete, recommendQuest, updateQuestById, getQuestQr, userAttend, creatorRemoveUser } from "../controller/quest.js";
import { verifyCreator, verifyUser } from "../middleware/auth.js";
import { upload } from "../middleware/uploadImg.js";

const router = Router()

router.get("/", getQuest)
router.get("/:id/find", verifyUser, getQuestById)
router.get("/:id/participants", getQuestParticipantsById)
router.get("/recommend", recommendQuest)
router.get("/creator-all", verifyCreator, getCreatorQuests)
router.get("/creator-uncomplete", verifyCreator, getUncompleteCreatorQuest)
router.get("/:id/qr", verifyCreator, getQuestQr)

router.post("/locations/:locationId", verifyCreator, upload.single('img'), createQuest)

router.put("/:id", verifyCreator, upload.single('img'), updateQuestById)

router.patch("/:id/complete", verifyCreator, questComplete)
router.patch("/:id/join-leave", verifyUser, joinOrLeaveQuest)
router.patch("/:id/attend", verifyUser, userAttend)
router.patch("/:questId/remove-user/:userId", verifyCreator, creatorRemoveUser)

router.delete("/:id", verifyCreator, deleteQuestById)



export default router