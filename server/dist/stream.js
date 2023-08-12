"use strict";
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
exports.uploadFile = void 0;
const config_1 = __importDefault(require("./config"));
var { google } = require("googleapis");
const CLIENT_ID = config_1.default.CLIENT_ID;
const CLIENT_SECRET = config_1.default.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = config_1.default.REFRESH_TOKEN;
const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const drive = google.drive({ version: "v3", auth: oauth2client });
oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });
const uploadFile = (file, filepath, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield drive.files.create({
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
    }
    catch (error) { }
});
exports.uploadFile = uploadFile;
