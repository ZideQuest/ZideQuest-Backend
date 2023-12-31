import { Router } from "express";
import { createLocation, getAllLocation, getLocationById, updateLocationById, deleteLocaitonById } from "../controller/location.js";
import { verify, verifyAdmin, verifyCreator } from "../middleware/auth.js";
import { upload } from "../middleware/uploadImg.js";
const router = Router();

router.post("/", verifyCreator, upload.single('img'), createLocation);
router.get("/", verify, getAllLocation);
router.get("/:id", verify, getLocationById);
router.put("/:id", verifyCreator, upload.single('img'), updateLocationById);
router.delete("/:id", verifyCreator, deleteLocaitonById);

export default router;