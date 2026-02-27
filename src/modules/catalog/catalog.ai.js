import OpenAI from "openai";
import { GROQ_API_KEY } from "../../config/env.js";
import { PRIMARY_CATEGORIES, SUSTAINABILITY_FILTERS } from "./catalog.constants.js";

const openai = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Build strict prompt
 */
const buildPrompt = (productName, description) => {
  return `
You are a sustainable commerce product classification engine.

STRICT RULES:
1. primaryCategory MUST be selected ONLY from:
${PRIMARY_CATEGORIES.join(", ")}

2. sustainabilityFilters MUST be selected ONLY from:
${SUSTAINABILITY_FILTERS.join(", ")}

3. If none apply, return empty array [].
4. seoTags must contain between 5 and 10 short SEO-friendly tags.
5. subCategory must always be a short string.
6. Return ONLY valid JSON.
7. Do NOT add explanations.
8. Do NOT wrap in markdown.

Product Name: ${productName}
Description: ${description}

Return EXACTLY this JSON format:

{
  "primaryCategory": "",
  "subCategory": "",
  "seoTags": [],
  "sustainabilityFilters": []
}
`;
};

/**
 * Normalize AI Output Safely
 */
const normalizeOutput = (parsed) => {

  // Ensure subCategory
  if (
    !parsed.subCategory ||
    typeof parsed.subCategory !== "string" ||
    parsed.subCategory.trim().length === 0
  ) {
    parsed.subCategory = "General";
  } else {
    parsed.subCategory = parsed.subCategory.trim();
  }

  // Ensure SEO tags
  if (!Array.isArray(parsed.seoTags)) {
    parsed.seoTags = [];
  }

  parsed.seoTags = parsed.seoTags
    .map(tag => String(tag).toLowerCase().trim())
    .filter(Boolean)
    .slice(0, 10);

  while (parsed.seoTags.length < 5) {
    parsed.seoTags.push("sustainable");
  }

  // Ensure sustainability filters
  if (!Array.isArray(parsed.sustainabilityFilters)) {
    parsed.sustainabilityFilters = [];
  }

  parsed.sustainabilityFilters = parsed.sustainabilityFilters.filter(filter =>
    SUSTAINABILITY_FILTERS.includes(filter)
  );

  // Ensure valid primary category
  if (!PRIMARY_CATEGORIES.includes(parsed.primaryCategory)) {
    parsed.primaryCategory = PRIMARY_CATEGORIES[0]; // safe fallback
  }

  return parsed;
};

export const generateAIClassification = async (productName, description) => {
  const prompt = buildPrompt(productName, description);

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a strict JSON classification engine."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    });

    const raw = response?.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("AI returned empty response");
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("Invalid JSON from AI");
    }

    const normalized = normalizeOutput(parsed);

    return {
      prompt,
      raw,
      data: normalized
    };

  } catch (error) {
    console.error("AI ERROR:", error.message);
    throw error;
  }
};