import mongoose from "mongoose";
import { PRIMARY_CATEGORIES, SUSTAINABILITY_FILTERS } from "./catalog.constants.js";

const catalogSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    primaryCategory: {
      type: String,
      required: true,
      enum: PRIMARY_CATEGORIES,
      index: true
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    seoTags: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length >= 5 && value.length <= 10;
        },
        message: "SEO tags must be between 5 and 10"
      },
      index: true
    },

    sustainabilityFilters: {
      type: [
        {
          type: String,
          enum: SUSTAINABILITY_FILTERS
        }
      ],
      default: [],
      index: true
    },

    aiPrompt: {
      type: String,
      required: true
    },

    aiRawResponse: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// 🔎 Full-text search index
catalogSchema.index({
  productName: "text",
  description: "text",
  seoTags: "text"
});

export default mongoose.model("Catalog", catalogSchema);