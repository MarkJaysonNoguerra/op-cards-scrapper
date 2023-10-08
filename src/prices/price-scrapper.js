import dotenv from "dotenv";
dotenv.config();

export class PriceScrapper {
  #cardsSelector = "#card-list3";

  constructor(page, card) {
    this.page = page;
    this.card = card;
  }

  async insertOrUpdateCardPrice() {
    await this.setup();
    const cardsContainers = await this.page.$$(this.#cardsSelector);

    const price = await this.getPrice(
      cardsContainers,
      this.card?.parallel ? parseInt(this.card.parallel.substring(1)) - 1 : 0,
      !!this.card?.parallel
      // minus 1 on the parallel for array index
    );
    this.card.priceInYen = price ? parseInt(price) : null;
  }

  async setup() {
    await this.page.goto(this.getYuyuTeiUrl(this.card.cardSerial), {
      timeout: 300000,
      waitUntil: "domcontentloaded",
    });
  }

  async getPrice(cardsContainers, parallelIndex, hasParallel) {
    if (cardsContainers.length === 0) {
      return null;
    }

    // parallel card price base on parallel index
    if (hasParallel) {
      if (cardsContainers.length <= 1) {
        return null; //should return null if there is no data for parallel
      }
      return await cardsContainers[0]?.evaluate((x, parallelIndex) => {
        return (
          x
            .querySelectorAll(".col-md")
            [parallelIndex]?.querySelector(".text-end")
            ?.textContent?.replace(",", "")
            .match(/(\d+)/)[0] ?? null
        );
      }, parallelIndex);
    }

    // normal card price
    // if cardsContainer count is equal to 1 the normal card should be placed in the zero index otherwise it's in 1 inde
    return await cardsContainers[
      cardsContainers.length === 1 ? 0 : 1
    ]?.evaluate(
      (x) =>
        x
          .querySelectorAll(".col-md")[0]
          ?.querySelector(".text-end")
          ?.textContent?.replace(",", "")
          .match(/(\d+)/)[0] ?? null
    );
  }

  getYuyuTeiUrl(cardSerial) {
    return `${process.env.pricesUrl}${cardSerial}&rare=&type=&kizu=0`;
  }
}
