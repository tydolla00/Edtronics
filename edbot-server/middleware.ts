import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://edbot.vercel.app",
        "https://edbot-tydolla00.vercel.app/",
        "https://edbot-git-main-tydolla00.vercel.app/",
      ]
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://www.google.com",
      ];

// * All Requests will come through here first.
export function middleware(request: Request, res: NextApiResponse) {
  const origin = request.headers.get("origin");
  const response = res.setHeader("Access-Control-Allow-Origin", "*");
  const response2 = res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  console.log(
    "🚀 ~ file: middleware.ts:21 ~ middleware ~ response2:",
    response2
  );
  console.log("🚀 ~ file: middleware.ts:19 ~ middleware ~ response:", response);
  console.log("🚀 ~ file: middleware.ts:18 ~ middleware ~ origin:", origin);
  if (origin && !allowedOrigins.includes(origin))
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  console.log(
    "🚀 ~ file: middleware.ts:28 ~ middleware ~ request.method:",
    request.method
  );
  return NextResponse.next();
}
