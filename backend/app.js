import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import logger from "./utils/logger.js"

const app = express();

// logger setup
if (process.env.NODE_ENV === "development") {
  const morganFormat = ":method :url :status :response-time ms";

  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );
}

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extends: true, limit: "16kb" }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Access",
    ],
  })
);

// Api routes imports
import userRouter from "./routes/user.routes.js";
import saleRouter from "./routes/sale.routes.js";
import productRouter from "./routes/product.routes.js";
import barcodeRouter from "./routes/barcode.routes.js";

// Api routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/sale", saleRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/barcode", barcodeRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found ❌",
  });
});

export { app };
