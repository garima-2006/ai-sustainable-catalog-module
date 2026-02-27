import Catalog from "./catalog.model.js";
import { generateAIClassification } from "./catalog.ai.js";
import { validateAIOutput } from "./catalog.validator.js";

export const processCatalog = async (productName, description) => {
  try {
    // 1️⃣ Call AI Layer
    const { prompt, raw, data } = await generateAIClassification(
      productName,
      description
    );

    // 2️⃣ Validate Structured Output
    validateAIOutput(data);

    // 3️⃣ Save to Database
    const saved = await Catalog.create({
      productName,
      description,
      ...data,
      aiPrompt: prompt,
      aiRawResponse: raw
    });

    return saved;

  } catch (error) {
    console.error("PROCESS CATALOG ERROR:", error.message);
    throw new Error("Failed to process catalog");
  }
};