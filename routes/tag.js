import { Router } from "express";;
import { createTag, updateTagById, getTag, deleteTagById, getTagById, getTagColor } from "../controller/tag.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router()

router.get("/", getTag)
router.get("/:id", getTagById)
router.post("/", verifyAdmin, createTag)
router.put("/:id", verifyAdmin, updateTagById)
router.delete("/:id", verifyAdmin, deleteTagById)


router.patch("/", getTagColor)
export default router