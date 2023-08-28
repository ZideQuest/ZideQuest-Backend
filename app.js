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
import accountRoutes from './routes/account.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import questRoutes from './routes/quest.js'
import locationRoutes from './routes/location.js'
import adminRoutes from './routes/admin.js'
import creatorRoutes from './routes/creator.js'
import tagRoutes from './routes/tag.js'
import searchRoutes from './routes/search.js'
import { errorMiddleware } from './middleware/errorHandler.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'


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

    const swaggerDocument = YAML.load('./docs/swagger.yaml');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // just logging testing middleware
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
        app.use((req, res, next) => {
            req.requestTime = new Date().toISOString();
            next();
        });
    }

    // routes
    app.use("/api/account", accountRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/quest", questRoutes);
    app.use("/api/location", locationRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/creator", creatorRoutes);
    app.use("/api/tag", tagRoutes);
    app.use("/api/search", searchRoutes);

    // Error handler
    app.use(errorMiddleware);
    return app
}

export default createApp