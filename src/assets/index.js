import process from "process";
import { createDirectory, readObjFromJson } from "../helpers/files.js";
import { downloadImage } from "./downloader.js";

const assetDir = "./dist/assets";
const dataDir = "./dist/data";

(async () => {
  // get argument
  const file = process.argv[2];
  const newAssets = `${assetDir}/${file}`;
  createDirectory(newAssets);

  const cardCollection = readObjFromJson(`${dataDir}/${file}`);
  for (const series in cardCollection) {
    for (const card of cardCollection[series]) {
      await downloadImage(`${newAssets}/${card.id}.png`, card.image);
    }
  }

  console.log("finish downloading assets");
})();
