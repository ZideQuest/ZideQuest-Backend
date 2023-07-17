import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { errorMiddleware } from './middleware/errorHandler.js'
import basicRoutes from './routes/basic-api.js'
import { logger } from './util/logger.js'
import { connectDb } from './util/connectDb.js'

function main() {
    // express app
    const app = express()

    // dotenv
    dotenv.config()

    // middleware configuration
    app.use(express.json())
    app.use(cookieParser())
    app.use(morgan("dev"))

    // router
    app.use("/api/basic-api", basicRoutes)
    // error handler
    app.use(errorMiddleware)


    // listening 
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        logger.info(`server start at http://localhost:${PORT}`)
        connectDb()
    })

}

main()