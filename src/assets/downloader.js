import axios from "axios";
import fs from "fs";
import https from "https";

export const downloadImage = async (path, url) => {
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    // Wait for the image to finish downloading
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    console.log("sucessfully downloaded " + path);
  } catch (err) {
    console.error("Error downloading image:", err.message);
  }
};
