import puppeteer from "puppeteer";
import process from "process";
import { readObjFromJson, saveObjToJson } from "../helpers/files.js";
import { PriceScrapper } from "./price-scrapper.js";

const dataDir = "./dist/data";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  const file = `${dataDir}/${process.argv[2]}`;
  const cardsCollection = readObjFromJson(file);
  for (const series in cardsCollection) {
    for (const card of cardsCollection[series]) {
      const scrapper = new PriceScrapper(page, card);
      await scrapper.insertOrUpdateCardPrice();
      console.log(
        `Update/Created price for card # ${card.id} ${card.cardName}`
      );
    }
  }

  saveObjToJson(cardsCollection, file);
  await browser.close();
  console.log("Added card prices on the json file.");
})();
