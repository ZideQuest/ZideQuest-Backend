import { Router } from "express";
import { createLocation, getAllLocation, getLocationById, updateLocationById, deleteLocaitonById } from "../controller/location.js";
import { verifyAdmin, verifyCreator } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyCreator, createLocation);
router.get("/", getAllLocation);
router.get("/:id", getLocationById);
router.put("/:id", verifyCreator, updateLocationById);
router.delete("/:id", verifyCreator, deleteLocaitonById);

export default router;