import { Router } from "express";;
import { getSearch } from "../controller/search.js";


const router = Router()

router.get("", getSearch)

export default router