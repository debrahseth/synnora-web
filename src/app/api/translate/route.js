// app/api/translate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return new NextResponse(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetLang = lang || "en";

    // Ensure you have your API key in .env
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: "OpenAI API key missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI API for translation
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful translator. Translate the user's text into ${targetLang}.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0,
        }),
      }
    );

    const openaiData = await openaiRes.json();

    if (!openaiData.choices || openaiData.choices.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "OpenAI returned no translation",
          data: openaiData,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const translatedText = openaiData.choices[0].message.content.trim();

    return new NextResponse(
      JSON.stringify({
        original: text,
        translated: translatedText,
        targetLang,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Translation API error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
