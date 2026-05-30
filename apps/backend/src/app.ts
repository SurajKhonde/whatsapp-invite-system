import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { serverAdapter } from "@core/queue/board";
import mainRoutes from "./routes";
import { errorHandler } from "@core/errors/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

// 🔥 Security middleware
app.use(helmet());

// 🔥 CORS
const allowedOrigins = [
  "https://pilooopu.shop",
  "https://www.pilooopu.shop",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
// 🔥 Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/public", express.static(path.join(process.cwd(), "src/public")));
app.use("/api", mainRoutes);
app.use("/admin/queues", serverAdapter.getRouter());
// ❌ 404 handler (important)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    "notify": false,
  });
});

// 🔥 Global error handler (LAST)
app.use(errorHandler);

export default app;