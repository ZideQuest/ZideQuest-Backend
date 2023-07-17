import { Router } from "express";
import { helloWorld } from "../controller/basic-api.js";

const router = Router()

router.get("/", helloWorld)

export default router