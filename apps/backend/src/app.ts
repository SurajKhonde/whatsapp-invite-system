import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { serverAdapter } from "@core/queue/board";
import mainRoutes from "./routes";
import { errorHandler } from "@core/errors/errorHandler";
import cookieParser from "cookie-parser";


const app = express();

// 🔥 Security middleware
app.use(helmet());

// 🔥 CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
// 🔥 Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 🔥 Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 API routes
app.use("/api", mainRoutes);
app.use("/admin/queues", serverAdapter.getRouter());
// ❌ 404 handler (important)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 Global error handler (LAST)
app.use(errorHandler);

export default app;