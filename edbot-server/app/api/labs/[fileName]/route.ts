import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { NextApiResponse } from "next";

export async function GET(
  request: Request,
  res: NextApiResponse,
  { params }: { params: { fileName: string } }
) {
  const fileName = params.fileName;
  const filePath = path.join(process.cwd(), "public", "audio", fileName);
  fs.createReadStream(filePath).pipe(res);
  return new NextResponse("Enjoy your audio", {
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "audio/mpeg",
    },
  });
}
