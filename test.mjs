import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function gradeThreeLevel() {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: '',
  });
  console.log(response.text);

}

gradeThreeLevel();