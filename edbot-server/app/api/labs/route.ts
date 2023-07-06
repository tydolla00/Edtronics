import config from "../../config";
import { NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const origin = req.headers.get("origin");

  console.log("hello");
  try {
    const body = await req.json();
    const message = body.message;
    const voice = body.voice;

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      { text: message },
      {
        headers: {
          accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": config.ELVN_API_KEY,
        },
        responseType: "stream",
      }
    );
    if (response.status !== 200)
      throw new Error("Oops, something unexpected happened.");

    const file = Math.random().toString(36).substring(7);
    const filePath = path.join(process.cwd(), "public", "audio", `${file}.mp3`);

    response.data.pipe(fs.createWriteStream(filePath));
    return new NextResponse(JSON.stringify(`file: ${file}.mp3`), {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Oops, something went wrong");
  }
}
