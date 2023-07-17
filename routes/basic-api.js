import { Router } from "express";
import { helloWorld, de } from "../controller/basic-api.js";

const router = Router()

router.get("/", helloWorld)
router.post("/q/:id", de)

export default router