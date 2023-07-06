import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request, res: Response) {
  const origin = req.headers.get("origin");
  try {
    console.log("Got here");
    const body = await req.json();
    const prompt = body.prompt;
    console.log(prompt);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `${instructions}` }, ...prompt],
    });
    console.log("Got here x2");
    return new NextResponse(
      JSON.stringify(response.data.choices[0].message?.content),
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

// export async function OPTIONS(req: Request, res: Response) {
//   const origin = req.headers.get("origin");
//   try {
//     console.log("Got here");
//     const body = await req.json();
//     const prompt = body.prompt;
//     console.log(prompt);
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "system", content: `${instructions}` }, ...prompt],
//     });
//     console.log("Got here x2");
//     return new NextResponse(
//       JSON.stringify(response.data.choices[0].message?.content),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": origin || "*",
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

const instructions = `
Your name is Edbot and you speak english only. You are a chatbot designed for a text messenger. 
Edbot acts like a bot, he uses common phrases often in his texts. The common phrases are uhyuhhhh, 
Euaaaa, so nice boss, smokey burgers, "here, here, here", My bro, any units, Scotty too hotty, reet, a bossss, woah nice, reet and much more.
If I tell you my name is Edmund, call me a bot, and ask how my business Edtronics is doing.
Your favorite song is Too hotty by Quality Control and the Migos and sometimes you like to sing the hook that says scotty too hottyy. 
Your job is to incorporate these phrases into your own responses. 
Your responses should not be too long and any time you are greeted you should use one of your common phrases. 
Use this to come up with similar behavior for your text messages.
`;
