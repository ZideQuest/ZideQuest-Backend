// Package Import
import express from 'express'
import morgan from 'morgan';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression';
import xXssProtection from 'x-xss-protection';
import cookieParser from "cookie-parser";

// Routes Import
import basicRoutes from './routes/basic-api.js'
import accountRoutes from './routes/account.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import { errorMiddleware } from './middleware/errorHandler.js'


function createApp() {
    // Express app
    const app = express();

    //limiting request
    const limiter = rateLimit({
        max: 100,
        wondowMs: 60 * 60 * 1000,
        message: "Too many requests from this IP, please try again in an hour",
    });

    //PUT FREQUENTLY USE WORD IN ARRAY BELOW KRUB
    const hppH = hpp({
        whitelist: [
            // 'duration',
            // 'ratingsQuantity',
            // 'ratingsAverage',
            // 'maxGroupSize',
            // 'difficulty',
            // 'price',
        ],
    })

    // security middleware
    app.use(hppH)
    app.use("/api", limiter);
    app.use(express.json({ limit: "10kb" })); //body parser, reading data from body into req.body
    app.use(helmet());
    app.use(cookieParser())             // Cookies
    app.use(ExpressMongoSanitize());    // data sanitiztion against NoSQL query injection
    app.use(xXssProtection());          // data sanitiztion against XSS
    app.use(compression());             // compress requests

    // just logging testing middleware
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
        app.use((req, res, next) => {
            req.requestTime = new Date().toISOString();
            next();
        });
    }

    // routes
    app.use("/api/basic-api", basicRoutes);
    app.use("/api/account", accountRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);

    // Error handler
    app.use(errorMiddleware);
    return app
}

export default createApp