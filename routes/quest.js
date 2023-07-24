import { Router } from "express";;
import { createQuest, deleteQuestById, getQuest, getQuestById, updateQuestById } from "../controller/quest.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.js";

const router = Router()

router.post("/:locationId", verifyAdmin, createQuest)
router.get("/", getQuest)
router.get("/:id", getQuestById)
router.put("/:id", verifyAdmin, updateQuestById)
router.delete("/:id", verifyAdmin, deleteQuestById)

export default router