import dotenv from "dotenv";
import path from "path";

// Parsing the env file.
dotenv.config();

// Interface to load env variables
interface ENV {
  ELVN_API_KEY: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  API_KEY: string | undefined;
}

interface Config {
  ELVN_API_KEY: string;
  PORT: number;
  MONGO_URI: string;
  API_KEY: string;
}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    ELVN_API_KEY: process.env.ELVN_API_KEY,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    API_KEY: process.env.API_KEY,
  };
};

// Throwing an Error if any field is undefined; we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good, return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
