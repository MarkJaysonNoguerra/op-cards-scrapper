export class CardScrapper {
  constructor(card) {
    this.card = card;
  }

  async cardMetaData() {
    return await this.card.evaluate((x) => {
      const [cardSerial, parallel] = x.id.split("_");
      const [series, serialNumber] = cardSerial.split("-");
      return {
        id: x.id,
        parallel,
        series,
        serialNumber,
        cardSerial,
      };
    });
  }

  async cardRarity() {
    return await this.card.evaluate((x) => {
      const info = x.querySelectorAll(".infoCol span");
      return {
        rarity: info[1].textContent,
        cardType: info[2].textContent,
      };
    });
  }

  async getLastChildText(selector, altValue = null) {
    return await this.card.evaluate(
      (x, selector, altValue) =>
        x.querySelector(selector)?.lastChild?.textContent ?? altValue,
      selector,
      altValue
    );
  }

  async getTextContent(selector, altValue) {
    return await this.card.evaluate(
      (x, selector, altValue) => {
        result = x.querySelector(selector)?.textContent ?? altValue; // if null return altValue
        result = result === "" ? altValue : result; // if empty string return altvalue
        return result;
      },
      selector,
      altValue
    );
  }

  async getSrc(selector, altValue = null) {
    return await this.card.evaluate(
      (x, selector, altValue) => x.querySelector(selector)?.src ?? altValue,
      selector,
      altValue
    );
  }
}
