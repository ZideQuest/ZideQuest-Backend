const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const compression = require("compression");
import { logger } from "./util/logger.js";
import cookieParser from "cookie-parser";

// const AppError = require("./utils/appError");
// const errorController = require("./controllers/errorController");
// const tourRouter = require("./routes/tourRoutes");
// const userRouter = require("./routes/userRoutes");
// const reviewRouter = require("./routes/reviewRoutes");

import basicRoutes from './routes/basic-api.js'
import accountRoutes from './routes/account.js'
import { errorMiddleware } from './middleware/errorHandler.js'

const app = express();

// security middleware
//set security for http headers
app.use(helmet());

//limiting request
const limiter = rateLimit({
  max: 100,
  wondowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// just logging testing middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });
}

//body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser())

//data sanitiztion against NoSQL query injection
app.use(mongoSanitize());

//data sanitiztion against XSS
app.use(xss());

//clear up parameter pollution
//PUT FREQUENTLY USE WORD IN ARRAY BELOW KRUB
app.use(
  hpp({
    whitelist: [
      // 'duration',
      // 'ratingsQuantity',
      // 'ratingsAverage',
      // 'maxGroupSize',
      // 'difficulty',
      // 'price',
    ],
  })
);

//compress requests
app.use(compression());

//routes
app.use("/api/basic-api", basicRoutes);
app.use("/api/account", accountRoutes);

//error middleware routes
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });
app.use(errorMiddleware);

//start server
module.exports = app;
