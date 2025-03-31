import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";


console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      history: [],
      config: {
          systemInstruction: "You are a helpful assistant of IIT Madras who solves any query related to IIT Madras. You are succinct and provide just enough information to be useful",
      }
    });

    const stream = await chat.sendMessageStream({ message });

    let responseText = "";
    for await (const chunk of stream) {
      responseText += chunk.text;
    }

    return NextResponse.json({ reply: responseText.trim() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
