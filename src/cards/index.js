import { CardScrapper } from "./card-scrapper.js";
import dotenv from "dotenv";
dotenv.config();

export class Cards {
  #cardListUrl = process.env.cardUrl;
  #cardsSelector = ".modalCol";

  constructor(page) {
    this.page = page;
  }

  async collect() {
    await this.setup();
    return await this.collectData();
  }

  async setup() {
    await this.page.goto(this.#cardListUrl, {
      timeout: 300000,
      waitUntil: "networkidle2",
    });
  }

  async getCards(result = {}) {
    const cards = await this.page.$$(this.#cardsSelector);
    for (const card of cards) {
      const cardScrapper = new CardScrapper(card);
      const cardMetaData = await cardScrapper.cardMetaData();
      const cardRarity = await cardScrapper.cardRarity();

      const cardDetails = {
        cost: await cardScrapper.getLastChildText(".cost"),
        power: await cardScrapper.getLastChildText(".power"),
        counter: await cardScrapper.getLastChildText(".counter"),
        color: await cardScrapper.getLastChildText(".color"),
        type: await cardScrapper.getLastChildText(".feature"),
        effect: await cardScrapper.getLastChildText(".text"),
        cardSet: await cardScrapper.getLastChildText(".getInfo"),
        attribute: await cardScrapper.getTextContent(".attribute i", " -"),
        cardName: await cardScrapper.getTextContent(".cardName"),
        image: await cardScrapper.getSrc(".frontCol img"),
        trigger: await cardScrapper.getLastChildText(".trigger"),
      };

      if (!(cardMetaData.series in result)) {
        result[cardMetaData.series] = [];
      }

      result[cardMetaData.series].push({
        ...cardMetaData,
        ...cardRarity,
        ...cardDetails,
      });
    }
    return result;
  }

  async collectData() {
    let result = {};
    const editions = await this.getEditions();
    for await (let [index, _] of editions.entries()) {
      // skip the select all options
      if (index <= 2) {
        continue;
      }

      // select edition
      await this.page.$eval(`[data-value]:nth-of-type(${index})`, (element) =>
        element.click()
      );

      // click search
      await this.page.$eval('.submitBtn [value="SEARCH"]', (element) =>
        element.click()
      );
      await this.page.waitForNavigation({
        timeout: 300000,
        waitUntil: "networkidle2",
      });

      result = await this.getCards(result);
    }
    return result;
  }

  async getEditions() {
    return await this.page.$$("[data-value]");
  }
}
