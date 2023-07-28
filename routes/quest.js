import { Router } from "express";;
import { createQuest, deleteQuestById, getQuest, getQuestById, getQuestParticipantsById, joinOrLeaveQuest, updateQuestById } from "../controller/quest.js";
import { verifyCreator, verifyUser } from "../middleware/auth.js";

const router = Router()

router.post("/:locationId", verifyCreator, createQuest)
router.get("/find", getQuest)
router.get("/find/:id", getQuestById)
router.get("/participants/:id", getQuestParticipantsById)
router.put("/:id", verifyCreator, updateQuestById)
router.put("/join-leave/:id", verifyUser, joinOrLeaveQuest)
router.delete("/:id", verifyCreator, deleteQuestById)



export default router