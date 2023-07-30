import { Router } from "express";;
import { createQuest, deleteQuestById, getQuest, getQuestById, getQuestParticipantsById, joinOrLeaveQuest, questComplete, updateQuestById } from "../controller/quest.js";
import { verifyCreator, verifyUser } from "../middleware/auth.js";

const router = Router()

router.get("/find", getQuest)
router.get("/find/:id", getQuestById)
router.get("/participants/:id", getQuestParticipantsById)

router.post("/location/:locationId", verifyCreator, createQuest)
router.post("/complete/:id", verifyCreator, questComplete)

router.put("/find/:id", verifyCreator, updateQuestById)
router.put("/join-leave/:id", verifyUser, joinOrLeaveQuest)

router.delete("/:id", verifyCreator, deleteQuestById)



export default router