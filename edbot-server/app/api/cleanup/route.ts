import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

const AUDIO_DIRECTORY = path.join(process.cwd(), "public/audio");

export async function GET(req: Request, res: Response) {
  const origin = req.headers.get("origin");

  try {
    const maxAgeInMinutes = 30; // Maximum age for audio files (adjust as needed)

    // Trigger the asynchronous function to delete old files.
    await deleteOldAudioFiles(AUDIO_DIRECTORY, maxAgeInMinutes);

    return new NextResponse("Files succesfully deleted!", {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Oops something went wrong");
  }
}

export async function deleteOldAudioFiles(
  directory: string,
  maxAgeInMinutes: number
) {
  const currentTime = Date.now();
  const maxAgeInMillis = maxAgeInMinutes * 60 * 1000;

  try {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.promises.stat(filePath);
      const fileAge = currentTime - stats.mtime.getTime();

      if (file.endsWith(".mp3") && fileAge > maxAgeInMillis) {
        await fs.promises.unlink(filePath);
        console.log(`${file} deleted successfully.`);
      }
    }
  } catch (err) {
    console.error("Error cleaning up audio files:", err);
  }
}
