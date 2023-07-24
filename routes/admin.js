import { Router } from "express";;
import { createAdmin, getAdmin, getAdminById, deleteAdminById, updateAdminById } from "../controller/admin.js";

const router = Router()

router.post("/", createAdmin)
router.get("/", getAdmin)
router.get("/:id", getAdminById)
router.delete("/:id", deleteAdminById)
router.put("/:id", updateAdminById)

export default router