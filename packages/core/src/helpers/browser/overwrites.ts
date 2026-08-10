/**
 * Attempts to click an element. If the element is not clickable, it can be scrolled into view before clicking.
 *
 * @param {Function} origClickFunction - The original click function to execute.
 * @param {Object} options - Options for clicking.
 * @param {boolean} [options.force=false] - If `true`, clicks with JavaScript even if the element is not visible or clickable.
 * @returns {Promise<void>} A Promise that resolves when the click operation is completed.
 * @throws {Error} If the element cannot be clicked for any reason.
 */
export async function click(origClickFunction, {
  force = false,
} = {}) {
  if (!force) {
    try {
      // attempt to click
      return origClickFunction()
    } catch (err) {
      if (err.message.includes('not clickable at point')) {
        await console.warn(
          `WARN: Element "${ this.selector }" is not clickable.`,
          'Scrolling to it before clicking again.')

        // scroll to element and click again
        await this.scrollIntoView()
        return origClickFunction()
      }

      if (err.message.includes('Other element would receive the click')) {
        await console.warn(
          `WARN: Element "${ this.selector }" would not receive the click.`,
          'Scrolling to it before clicking again.')

        // scroll to element and click again
        await this.scrollIntoView()
        return origClickFunction()
      }

      throw err
    }
  }

  await console.warn('WARN: Using force click for', this.selector)
  return browser.execute((el) => {
    return el.click()
  }, this)
}
