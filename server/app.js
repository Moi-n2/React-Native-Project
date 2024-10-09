import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import ErrorMiddleWare from "./middleware/error.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(cors());

app.use("/api/v1", userRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);
app.use(ErrorMiddleWare);

export default app;
