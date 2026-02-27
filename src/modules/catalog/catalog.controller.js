import { processCatalog } from "./catalog.service.js";
import { successResponse } from "../../shared/apiResponse.js";

export const generateCatalog = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body missing" });
    }

    const { productName, description } = req.body;

    if (!productName || !description) {
      return res.status(400).json({ error: "productName and description required" });
    }

    const result = await processCatalog(productName, description);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};