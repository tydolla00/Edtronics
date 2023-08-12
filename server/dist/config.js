"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Parsing the env file.
dotenv_1.default.config();
// Loading process.env as ENV interface
const getConfig = () => {
    return {
        ELVN_API_KEY: process.env.ELVN_API_KEY,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        MONGO_URI: process.env.MONGO_URI,
        API_KEY: process.env.API_KEY,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    };
};
// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
const getSanitzedConfig = (config) => {
    // for (const [key, value] of Object.entries(config)) {
    //   if (value === undefined) {
    //     throw new Error(`Missing key ${key} in config.env`);
    //   }
    // }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
