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
exports.deleteOldAudioFiles = exports.AUDIO_DIRECTORY = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.AUDIO_DIRECTORY = path_1.default.join(__dirname, "./audio");
// * Deletes mp3 files older than 30 min (maxAgeInMinutes) in /dist/audio
const deleteOldAudioFiles = (directory, maxAgeInMinutes) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = Date.now();
    const maxAgeInMillis = maxAgeInMinutes * 60 * 1000;
    try {
        const files = yield fs_1.default.promises.readdir(directory);
        for (const file of files) {
            const filePath = path_1.default.join(directory, file);
            const stats = yield fs_1.default.promises.stat(filePath);
            const fileAge = currentTime - stats.mtime.getTime();
            if (file.endsWith(".mp3") && fileAge > maxAgeInMillis) {
                yield fs_1.default.promises.unlink(filePath);
                console.log(`${file} deleted successfully.`);
            }
        }
    }
    catch (err) {
        console.error("Error cleaning up audio files:", err);
    }
});
exports.deleteOldAudioFiles = deleteOldAudioFiles;
module.exports = { AUDIO_DIRECTORY: exports.AUDIO_DIRECTORY, deleteOldAudioFiles: exports.deleteOldAudioFiles };
