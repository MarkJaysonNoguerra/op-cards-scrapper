import puppeteer from "puppeteer";
import { Cards } from "./cards/index.js";
import { saveObjToJson, getCurrentDate } from "./helpers/files.js";

const distDataDirectory = "./dist/data";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  const cards = new Cards(page);
  const cardsCollection = await cards.collect();

  const outputFile = `${getCurrentDate()}.json`;
  saveObjToJson(cardsCollection, `${distDataDirectory}/${outputFile}`);

  await browser.close();
})();
