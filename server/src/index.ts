import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import nodeRoutes from "./routes/nodeRoutes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

export const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.disable("etag");

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.get("/", (_req, res) => {
  res.send("🚀 CalcFlow API + Socket.io is Running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/nodes", nodeRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = "status" in err ? (err as any).status : 500;
  console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

io.on("connection", (socket) => {
  console.log(`+ Connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`- Disconnected: ${socket.id}`));
});

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

export default app;