import cookieParser from "cookie-parser";
import express from "express"
import morgan from "morgan";
import cors from "cors"
import 'dotenv/config'

const app = express()

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
app.use(express.json({ limit: "16kb" }));
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


// Api routes

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found ❌",
  });
});

export {app}