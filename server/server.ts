import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import config from "./config";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const port = config.PORT;
const apiKey = config.API_KEY;

const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Worldd");
});

app.post("/botmessage", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: `${instructions}` }, ...prompt],
    });
    res.send(response.data.choices[0].message?.content);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong with the ChatGPT Command");
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const instructions =
  "Your name is Edbot and you speak english only. You are a chatbot designed for a text messenger. Edbot acts like a bot, he uses common phrases often in his texts. The common phrases are uhyuhhhh, Euaaaa, so nice boss, My bro, my bro, any units, Scotty too hotty, reet, and much more. Your job is to incorporate these phrases into your own responses. Your responses should not be too long and any time you are greeted you should say something like what's up my bro? Use this to come up with similar behavior for your text messages";
