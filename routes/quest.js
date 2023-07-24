import { Router } from "express";;
import { createQuest, deleteQuestById, getQuest, getQuestById, updateQuestById } from "../controller/quest.js";
import { verifyCreator } from "../middleware/auth.js";

const router = Router()

router.post("/:locationId", verifyCreator, createQuest)
router.get("/", getQuest)
router.get("/:id", getQuestById)
router.put("/:id", verifyCreator, updateQuestById)
router.delete("/:id", verifyCreator, deleteQuestById)



export default router