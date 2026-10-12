import { GoogleGenAI } from "@google/genai";

export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export const MODEL_NAME = "gemini-3.1-flash-lite";
export const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest"];
