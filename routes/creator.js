import { Router } from "express";
import { createCreator, getCreator, getCreatorById, deleteCreatorById, updateCreatorById } from "../controller/creator.js";
import { upload } from "../middleware/uploadImg.js";

const router = Router()

router.post("/", upload.single('img'), createCreator)
router.get("/", getCreator)
router.get("/:id", getCreatorById)
router.delete("/:id", deleteCreatorById)
router.put("/:id", updateCreatorById)

export default router