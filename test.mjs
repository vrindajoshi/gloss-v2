import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyA5jyCPZHWCuD6d5s9xrNI96nd3ubHNnVU" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: 'Why is the sky blue?',
  });
  console.log(response.text);
}

main();