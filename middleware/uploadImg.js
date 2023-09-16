import multer from "multer";

import path, { dirname, extname } from 'path'
const __dirname = process.cwd() // current dir

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/public/images"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname))
    }
})

export const upload = multer({ storage })