// app/api/translate/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    const { text, lang } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetLang = lang || "en";
    let translatedText = text;

    // Only translate if target language is not English
    if (targetLang !== "en") {
      const apiKey = process.env.SMARTCAT_API_KEY;

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Smartcat API key missing" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const translationResponse = await fetch(
        "https://api.smartcat.ai/v1/translate/text", // Smartcat Free Translate endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            sourceLanguage: "en",
            targetLanguage: targetLang,
            texts: [text], // Smartcat expects an array of strings
          }),
        }
      );

      // Read the response once as text
      const translationText = await translationResponse.text();
      let translationData;

      // Attempt to parse JSON
      try {
        translationData = JSON.parse(translationText);
      } catch (err) {
        console.error("Smartcat response is not valid JSON:", translationText);
        return new Response(
          JSON.stringify({
            error: "Invalid response from Smartcat API",
            raw: translationText,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Extract translated text
      if (
        translationData.translations &&
        translationData.translations.length > 0
      ) {
        translatedText = translationData.translations[0].text;
      } else {
        return new Response(
          JSON.stringify({
            error: "Smartcat API returned no translation",
            data: translationData,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        original: text,
        translated: translatedText,
        targetLang,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
