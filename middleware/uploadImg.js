import multer from "multer";

import path, { dirname, extname } from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url) // current file
const __dirname = fileURLToPath(import.meta.url) // current dir

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname))
    }
})

export const upload = multer({ storage })