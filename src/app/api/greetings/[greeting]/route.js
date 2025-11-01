import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { greeting } = await context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "greetings",
      `${greeting}.mp4`
    );
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Greeting video not found:", greeting, error);
    return new NextResponse(
      JSON.stringify({ error: `Video for greeting '${greeting}' not found` }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
