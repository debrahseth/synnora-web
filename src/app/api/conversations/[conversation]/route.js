import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { conversation } = await context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "conversations",
      `${conversation}.mp4`
    );
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("Conversation video not found:", conversation, error);
    return new NextResponse(
      JSON.stringify({
        error: `Video for conversation '${conversation}' not found`,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
