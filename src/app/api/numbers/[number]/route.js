import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { number } = await context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "numbers",
      `${number}.mp4`
    );
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Video not found:", error);
    return new NextResponse(JSON.stringify({ error: "Video not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
