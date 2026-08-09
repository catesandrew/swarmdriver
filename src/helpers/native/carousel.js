import {
  swipe,
} from './gestures'

export default class Carousel {
  constructor(opts) {
    this.carouselSelector = opts.carouselSelector
    this.cardSelector = opts.cardSelector
  }

  /**
   * Wait for the carousel to be (un)visible
   *
   * @param {bool} [reverse=false] - if true it instead waits for the selector
   * to not match any elements.
   */
  async waitForIsDisplayed(reverse = false) {
    const carouselSelectorEl = await this.carouselSelector
    await carouselSelectorEl.waitForDisplayed({
      reverse,
    })
  }

  /**
   * Return de carousel text
   * Carousel only has a max of 3 elements when 3 or more cards are provided
   * When the first or last card is active then 2 elements are present
   *
   * if first card is active
   *    the first of 2 elements is the active card
   * else if last card is active
   *    the last of 2 elements is the active card
   * else
   *    there are 3 elements and the active card is the middle one
   *
   * @param {string} nthCard Use 'first' to indicate the first card,
   *                 else use a different word to indicate the other card
   *                 like for example 'active'
   * @returns {String} Returns the text
   */
  async getCardText(nthCard) {
    await this.waitForIsDisplayed()

    await driver.waitUntil(
      async () => {
        const cards = await $$(this.cardSelector)
        return cards.length > 0
      }, {
        timeout: 5000,
        timeoutMsg: `Expected to have more than 0 cards withing ${ 5000 } milliseconds`,
        interval: 100,
      }
    )

    const cards = await $$(this.cardSelector)
    const cardNumber = nthCard === 'first' ? 0 : cards.length - 1

    /**
     * IMPORTANT:
     * iOS gives back the text of all child elements when you call `element.getText()` on the parent element.
     * Android DOES NOT have the text of the child elements on the parent, we need to get them ourselves.
     */
    let cardText = ''

    if (driver.isAndroid) {
      const androidCards = await cards[cardNumber].$$('*//android.widget.TextView')

      for (const el of androidCards) {
        // eslint-disable-next-line no-await-in-loop
        cardText = `${ cardText } ${ await el.getText() }`
      }
    } else {
      cardText = (await cards[cardNumber].getText()).trim()
    }

    // Replace all possible breaks, tabs and so on with a single space
    return cardText.replace(/(?:\r\n|\r|\n)/g, ' ')
  }

  /**
   * Swipe the carousel to the LEFT (from right to left)
   */
  async swipeLeft() {
    const carouselRectangles = await this.getCarouselRectangles()

    const y = Math.round(
      carouselRectangles.y + (carouselRectangles.height / 2)
    )

    swipe(
      {
        x: Math.round(
          carouselRectangles.width - (carouselRectangles.width * 0.2)
        ),
        y,
      },
      {
        x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.2)),
        y,
      }
    )
  }

  /**
   * Swipe the carousel to the RIGHT (from left to right)
   */
  async swipeRight() {
    const carouselRectangles = await this.getCarouselRectangles()
    const y = Math.round(
      carouselRectangles.y + (carouselRectangles.height / 2)
    )

    swipe(
      {
        x: Math.round(carouselRectangles.x + (carouselRectangles.width * 0.2)),
        y,
      },
      {
        x: Math.round(
          carouselRectangles.width - (carouselRectangles.width * 0.2)
        ),
        y,
      }
    )
  }

  /**
   * Get the carousel position and size
   *
   * @returns
   *  x: number,
   *  y: number,
   *  width: number,
   *  height: number,
   */
  async getCarouselRectangles() {
    let carouselRectangles
    if (this.carouselRectangles) {
      carouselRectangles = this.carouselRectangles
    } else {
      const carousel = await $(this.carouselSelector)
      const carouselRect = await driver.getElementRect(carousel.elementId)
      carouselRectangles = carouselRect
    }

    if (!this.carouselRectangles && carouselRectangles) {
      this.carouselRectangles = carouselRectangles
    }

    return carouselRectangles
  }
}
