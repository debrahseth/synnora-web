import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { color } = await context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "colors",
      `${color}.mp4`
    );
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Color video not found:", color, error);
    return new NextResponse(
      JSON.stringify({ error: `Video for color '${color}' not found` }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
