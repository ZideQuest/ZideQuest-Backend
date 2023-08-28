import { Router } from "express";;
import { createAdmin, getAdmin, getAdminById, deleteAdminById, updateAdminById } from "../controller/admin.js";
import { upload } from "../middleware/uploadImg.js";

const router = Router()

router.post("/", upload.single('img'), createAdmin)
router.get("/", getAdmin)
router.get("/:id", getAdminById)
router.delete("/:id", deleteAdminById)
router.put("/:id", upload.single('img'), updateAdminById)

export default router