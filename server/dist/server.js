"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const fs_1 = __importDefault(require("fs"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const openai_1 = require("openai");
const cleanup_1 = require("./cleanup");
dotenv.config();
const port = config_1.default.PORT;
const apiKey = config_1.default.API_KEY;
const configuration = new openai_1.Configuration({
    apiKey: apiKey,
});
const openai = new openai_1.OpenAIApi(configuration);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("./audio", express_1.default.static(path_1.default.join(__dirname, "audio")));
app.get("/", (req, res) => {
    res.send("Hello Worldd");
});
// ? Calls ChatGPT API with instructions and appeneds new prompt. Then returns bot's response.
app.post("/botmessage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prompt = req.body.prompt;
        const response = yield openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: `${instructions}` }, ...prompt],
        });
        res.send((_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
    }
    catch (error) {
        console.log(error);
        throw new Error("Something went wrong with the ChatGPT Command");
    }
}));
// ? Calls ElevenLabs API, passing in message and requested voice. Creates file, stores it in dist and
// ? returns file name to be used to access resource.
app.post("/labs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = req.body.message;
        const voice = req.body.voice;
        const response = yield axios_1.default.post(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, { text: message }, {
            headers: {
                accept: "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": config_1.default.ELVN_API_KEY,
            },
            responseType: "stream",
        });
        if (response.status !== 200)
            throw new Error("Oops, something unexpected happened.");
        const file = Math.random().toString(36).substring(7);
        const filePath = path_1.default.join(__dirname, "public", "audio", `${file}.mp3`);
        response.data.pipe(fs_1.default.createWriteStream(filePath));
        res.send(JSON.stringify({ file: `${file}.mp3` }));
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
}));
// ? Endpoint to serve the audio file when the client requests it
app.get("/audio/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path_1.default.join(__dirname, "public", "audio", fileName); // Path to the "audio" folder
    res.sendFile(filePath);
});
// Schedule the cleanup task once per day
// cron.schedule("0 0 * * *", async () => {
node_cron_1.default.schedule("*/10 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const maxAgeInMinutes = 30; // Maximum age for audio files (adjust as needed)
    // Trigger the asynchronous to delete old files.
    yield (0, cleanup_1.deleteOldAudioFiles)(cleanup_1.AUDIO_DIRECTORY, maxAgeInMinutes);
}));
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
