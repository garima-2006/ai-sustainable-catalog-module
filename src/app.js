import express from "express";
import cors from "cors";
import catalogRoutes from "./routes/catalog.routes.js";
import { errorHandler } from "./shared/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/api/catalog", catalogRoutes);

export default app;