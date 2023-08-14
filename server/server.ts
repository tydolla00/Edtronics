import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import config from "./config";
import fs from "fs";
import cron from "node-cron";
import axios from "axios";
import path from "path";
import { Configuration, OpenAIApi } from "openai";
import { AUDIO_DIRECTORY, deleteOldAudioFiles } from "./cleanup";
import { uploadFile } from "./stream";
import { stringify } from "flatted";

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
app.use(process.cwd(), express.static(path.join(__dirname, "public/audio")));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Worldd");
});

// ? Calls ChatGPT API with instructions and appeneds new prompt. Then returns bot's response.
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

// ? Calls ElevenLabs API, passing in message and requested voice. Creates file, stores it in dist and
// ? returns file name to be used to access resource.
app.post("/labs", async (req, res) => {
  try {
    const message = req.body.message;
    const voice = req.body.voice;
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`, // remove stream if doesn't work.
      {
        text: message,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.8, similarity_boost: 0.5 },
      },
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
    const filePath = path.join(process.cwd(), "public/audio", `${file}.mp3`);

    // res.send(stringify(response.data));
    // await uploadFile(file, filePath, response);

    response.data.pipe(fs.createWriteStream(filePath));
    res.send(JSON.stringify({ file: `${file}.mp3` }));
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

// ? Endpoint to serve the audio file when the client requests it
app.get("/audio/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(process.cwd(), "public/audio", fileName); // Path to the "audio" folder
  res.sendFile(filePath);
});

// Schedule the cleanup task once per day
// cron.schedule("0 0 * * *", async () => {
cron.schedule("*/10 * * * *", async () => {
  const maxAgeInMinutes = 5; // Maximum age for audio files (adjust as needed)

  // Trigger the asynchronous to delete old files.
  await deleteOldAudioFiles(AUDIO_DIRECTORY, maxAgeInMinutes);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

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
