import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function translateReadingLevel(textContent, targetLevel) {
    const prompt = `Rewrite the following text precisely at a ${targetLevel} reading level.\nMaintain the original meaning but adjust vocabulary and sentence complexity.\n\nText: ${textContent}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // return the generated text to caller
        return response.text || (response.output && response.output[0] && response.output[0].content) || '';
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}

// Simple Express server exposing GET /translate?text=...&level=...
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/translate', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const text = req.query.text;
    const level = req.query.level || 'grade 6';

    if (!text) return res.status(400).json({ error: 'Missing text query parameter' });

    try {
        const result = await translateReadingLevel(text, level);
        return res.json({ result });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Generation error' });
    }
});

app.listen(PORT, () => {
    console.log(`Translate endpoint listening on http://localhost:${PORT}/translate`);
});

