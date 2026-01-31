import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: 'Why is the sky blue?',
  });
  console.log(response.text);
  //console.log(process.env.GOOGLE_GEMINI_API_KEY);
}

main();