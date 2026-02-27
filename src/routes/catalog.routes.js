import express from "express";
import { generateCatalog } from "../modules/catalog/catalog.controller.js";

const router = express.Router();

router.post("/generate", generateCatalog);

export default router;