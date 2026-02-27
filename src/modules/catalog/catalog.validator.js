import { PRIMARY_CATEGORIES, SUSTAINABILITY_FILTERS } from "./catalog.constants.js";

export const validateAIOutput = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("AI output must be an object");
  }

  const {
    primaryCategory,
    subCategory,
    seoTags,
    sustainabilityFilters
  } = data;

  // 🔹 Primary Category Validation
  if (!primaryCategory || !PRIMARY_CATEGORIES.includes(primaryCategory)) {
    throw new Error("Invalid primary category");
  }

  // 🔹 Subcategory Validation
  if (!subCategory || typeof subCategory !== "string") {
    throw new Error("Invalid subCategory");
  }

  // 🔹 SEO Tags Validation
  if (!Array.isArray(seoTags)) {
    throw new Error("seoTags must be an array");
  }

  if (seoTags.length < 5 || seoTags.length > 10) {
    throw new Error("SEO tags must be between 5 and 10");
  }

  seoTags.forEach(tag => {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      throw new Error("Invalid SEO tag detected");
    }
  });

  // 🔹 Sustainability Filters Validation
  if (!Array.isArray(sustainabilityFilters)) {
    throw new Error("sustainabilityFilters must be an array");
  }

  sustainabilityFilters.forEach(filter => {
    if (!SUSTAINABILITY_FILTERS.includes(filter)) {
      throw new Error(`Invalid sustainability filter: ${filter}`);
    }
  });

  return true;
};