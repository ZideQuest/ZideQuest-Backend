import { Router } from "express";;
import { createCreator, getCreator, getCreatorById, deleteCreatorById, updateCreatorById } from "../controller/creator.js";

const router = Router()

router.post("/", createCreator)
router.get("/", getCreator)
router.get("/:id", getCreatorById)
router.delete("/:id", deleteCreatorById)
router.put("/:id", updateCreatorById)

export default router