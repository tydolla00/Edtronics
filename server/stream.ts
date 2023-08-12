// import google, { drive_v3 } from "googleapis";
import { AxiosResponse } from "axios";
import config from "./config";
import fs from "fs";
import path from "path";

var { google } = require("googleapis");

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = config.REFRESH_TOKEN;

const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const drive = google.drive({ version: "v3", auth: oauth2client });

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const uploadFile = async (
  file: string,
  filepath: string,
  res: AxiosResponse<any, any>
) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file,
        mimeType: "audio/mpeg",
      },
      media: {
        mimeType: "audio/mpeg",
        body: res.data,
      },
    });
    console.log(response.data);
    return response.data.id;
  } catch (error) {}
};
