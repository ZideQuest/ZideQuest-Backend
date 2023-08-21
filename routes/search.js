import { Router } from "express";;
import { getSearch } from "../controller/search.js";
//import { verifyAdmin } from "../middleware/auth.js";

const router = Router()

router.get("", getSearch)
//router.post("/", verifyAdmin, createTag)
//router.put("/:id", verifyAdmin, updateTagById)
//router.delete("/:id", verifyAdmin, deleteTagById)

export default router