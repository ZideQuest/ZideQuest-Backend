import { Router } from "express";
import { getLocationById, createLocation, updateLocationById, deleteLocaitonById } from "../controller/location.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/:id", verifyAdmin, createLocation);
router.get("/", getAllLocation);
router.get("/:id", getLocationById);
router.put("/:id", verifyAdmin, updateLocationById);
router.delete("/:id", verifyAdmin, deleteLocaitonById);

export default router;