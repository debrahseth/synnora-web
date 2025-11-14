export async function POST(req) {
  try {
    const body = await req.json();
    const { image, lang } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modelResponse = await fetch(
      "https://your-model-endpoint.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      }
    );

    const modelData = await modelResponse.json();

    if (!modelData.gesture) {
      return new Response(
        JSON.stringify({ error: "Gesture model did not return a result" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const detectedGesture = modelData.gesture;
    const targetLang = lang || "en";
    let translatedText = detectedGesture;

    if (targetLang !== "en") {
      const translationResponse = await fetch(
        "https://translation-api.ghananlp.org/v1/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.GHANANLP_API_KEY,
          },
          body: JSON.stringify({
            in: detectedGesture,
            lang: `en-${targetLang}`,
          }),
        }
      );

      const translationData = await translationResponse.json();
      if (translationData.out) {
        translatedText = translationData.out;
      }
    }

    return new Response(
      JSON.stringify({
        gesture: detectedGesture,
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
