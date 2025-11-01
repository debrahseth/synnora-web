import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request, context) {
  const { letter } = await context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "letters",
      `${letter}.mp4`
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
    return NextResponse.json(
      { error: `Video for letter "${letter}" not found.` },
      { status: 404 }
    );
  }
}
