import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client with proper User-Agent header for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, type, context } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Set up customized system instructions depending on the action type
    let systemInstruction = "You are a top-tier AI Ecommerce consultant and developer. Help the user optimize, generate, or analyze their retail business.";
    
    if (type === "page") {
      systemInstruction = `You are an expert Ecommerce UX designer and page content generator.
Generate a structured JSON layout representing a professionally designed landing page.
Output the result in valid JSON that aligns with the requested format:
{
  "title": "Page headline",
  "subtitle": "Page subheading",
  "heroCta": "Main button label",
  "sections": [
    { "title": "Section Title", "content": "Section description or paragraph detail" }
  ],
  "themeColor": "HEX code"
}`;
    } else if (type === "copy" || type === "generate-description") {
      systemInstruction = "You are an SEO expert copywriter. Generate compelling, highly-detailed, and attractive descriptions/marketing content. Format with subtle Markdown.";
    } else if (type === "optimize-pricing") {
      systemInstruction = "You are an ecommerce analyst. Analyze parameters and supply clear, professional price optimizations and competitor pricing strategies in Markdown.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Generated output successful.";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate contents from AI" },
      { status: 500 }
    );
  }
}
