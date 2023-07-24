import { Router } from "express";
import { createLocation, getAllLocation, getLocationById, updateLocationById, deleteLocaitonById } from "../controller/location.js";
import { verifyUser, verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyUser, createLocation);
router.get("/", getAllLocation);
router.get("/:id", getLocationById);
router.put("/:id", verifyUser, updateLocationById);
router.delete("/:id", verifyUser, deleteLocaitonById);
// router.post("/", verifyAdmin, createLocation);
// router.get("/", getAllLocation);
// router.get("/:id", getLocationById);
// router.put("/:id", verifyAdmin, updateLocationById);
// router.delete("/:id", verifyAdmin, deleteLocaitonById);

export default router;