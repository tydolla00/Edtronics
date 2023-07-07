import fs from "fs";
import path from "path";

export const AUDIO_DIRECTORY = path.join(process.cwd(), "public/audio");

// * Deletes mp3 files older than 30 min (maxAgeInMinutes) in /dist/audio
export const deleteOldAudioFiles = async (
  directory: any,
  maxAgeInMinutes: any
) => {
  const currentTime = Date.now();
  const maxAgeInMillis = maxAgeInMinutes * 60 * 1000;

  try {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.promises.stat(filePath);
      const fileAge = currentTime - stats.mtime.getTime();

      if (file.endsWith(".mp3") && fileAge > maxAgeInMillis) {
        await fs.promises.unlink(filePath);
        console.log(`${file} deleted successfully.`);
      }
    }
  } catch (err) {
    console.error("Error cleaning up audio files:", err);
  }
};

module.exports = { AUDIO_DIRECTORY, deleteOldAudioFiles };
