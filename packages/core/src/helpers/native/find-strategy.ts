import { roleElements } from 'aria-query'

const DEEP_SELECTOR = '>>>'
const ARIA_SELECTOR = 'aria/'
const DEFAULT_STRATEGY = 'css selector'
const DIRECT_SELECTOR_REGEXP = /^(id|css selector|xpath|link text|partial link text|name|tag name|class name|-android uiautomator|-android datamatcher|-android viewmatcher|-android viewtag|-ios uiautomation|-ios predicate string|-ios class chain|accessibility id):(.+)/
const XPATH_SELECTORS_START = [
  '/', '(', '../', './', '*/'
]
const NAME_MOBILE_SELECTORS_START = [
  'uia', 'xcuielementtype', 'android.widget', 'cyi', 'android.view'
]
const XPATH_SELECTOR_REGEXP = [
  // HTML tag
  /^([a-z0-9|-]*)/,
  // optional . or # + class or id
  /(?:(\.|#)(-?[_a-zA-Z]+[_a-zA-Z0-9-]*))?/,
  // optional [attribute-name="attribute-selector"]
  /(?:\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?:=(?:"|')([a-zA-z0-9\-_. ]+)(?:"|'))?\])?/,
  // *=query or =query
  /(\*)?=(.+)$/,
]

/**
 * Pick the WebDriver locator strategy that a selector string implies.
 *
 * The return type is widened to `string` rather than left as the inferred union
 * of the literals returned below. `findStrategy()` switches on this value and
 * carries three cases this function never produces — `'aria'`,
 * `'-android datamatcher'` and `'-android viewmatcher'`. Those branches are
 * inherited from the WebdriverIO implementation this module was adapted from,
 * where `defineStrategy()` does return them. Letting TypeScript narrow the
 * union would turn three blocks of dead-but-intentional code into compile
 * errors and pressure someone into deleting them; the wider type keeps them
 * reachable for whenever the missing `defineStrategy()` branches are ported.
 */
export const defineStrategy = (selector = ''): string => {
  // Check if user has specified locator strategy directly
  if (selector.match(DIRECT_SELECTOR_REGEXP)) {
    return 'directly'
  }
  // Use xPath strategy if selector starts with //
  if (XPATH_SELECTORS_START.some((option) => selector.startsWith(option))) {
    return 'xpath'
  }
  // Use link text strategy if selector starts with =
  if (selector.startsWith('=')) {
    return 'link text'
  }
  // Use partial link text strategy if selector starts with *=
  if (selector.startsWith('*=')) {
    return 'partial link text'
  }
  // Use id strategy if the selector starts with id=
  if (selector.startsWith('id=')) {
    return 'id'
  }
  // use shadow dom selector
  if (selector.startsWith(DEEP_SELECTOR)) {
    return 'shadow'
  }
  // Recursive element search using the UiAutomator library (Android only)
  if (selector.startsWith('android=')) {
    return '-android uiautomator'
  }
  // Recursive element search using the UIAutomation library (iOS-only)
  if (selector.startsWith('ios=')) {
    return '-ios uiautomation'
  }
  // Recursive element search using accessibility id
  if (selector.startsWith('~')) {
    return 'accessibility id'
  }
  // Class name mobile selector
  // for iOS = UIA...
  // for Android = android.widget
  if (NAME_MOBILE_SELECTORS_START.some((option) => selector.toLowerCase().startsWith(option))) {
    return 'class name'
  }
  // Use tag name strategy if selector contains a tag
  // e.g. "<div>" or "<div />"
  if (selector.search(/<[0-9a-zA-Z-]+( \/)*>/g) >= 0) {
    return 'tag name'
  }
  // Use name strategy if selector queries elements with name attributes for JSONWP
  // or if isMobile is used even when w3c is used
  // e.g. "[name='myName']" or '[name="myName"]'
  if (selector.search(/^\[name=("|')([a-zA-z0-9\-_.@=[\] ']+)("|')]$/) >= 0) {
    return 'name'
  }
  // Allow to move up to the parent or select current element
  if (selector === '..' || selector === '.') {
    return 'xpath'
  }
  // Any element with given class, id, or attribute and content
  // e.g. h1.header=Welcome or [data-name=table-row]=Item or #content*=Intro
  if (selector.match(new RegExp(XPATH_SELECTOR_REGEXP.map((rx) => rx.source).join('')))) {
    return 'xpath extended'
  }
  if (selector.match(/^\[role=[A-Za-z]+]$/)) {
    return 'role'
  }

  return 'default'
}

export const findStrategy = (selector = '') => {
  let using = DEFAULT_STRATEGY
  let value = selector
  let match,
      conditions

  switch (defineStrategy(selector)) {
    // user has specified locator strategy directly
    case 'directly':
      match = selector.match(DIRECT_SELECTOR_REGEXP)
      if (!match) {
        throw new Error('InvalidSelectorStrategy')
      }
      using = match[1]
      value = match[2]
      break

    case 'id':
      using = 'id'
      value = selector.slice(3)
      break

    // treat default as id
    case 'default':
      using = 'id'
      break

    case 'xpath':
      using = 'xpath'
      break

    case 'link text':
      using = 'link text'
      value = selector.slice(1)
      break

    case 'partial link text':
      using = 'partial link text'
      value = selector.slice(2)
      break

    case 'shadow':
      using = 'shadow'
      value = selector.slice(DEEP_SELECTOR.length)
      break

    case 'aria':
      // eslint-disable-next-line no-case-declarations
      const label = selector.slice(ARIA_SELECTOR.length)
      conditions = [
        // aria label is recevied by other element with aria-labelledBy
        // https://www.w3.org/TR/accname-1.1/#step2B
        `.//*[@aria-labelledby=(//*[normalize-space(text()) = "${ label }"]/@id)]`,
        // aria label is recevied by other element with aria-labelledBy
        // https://www.w3.org/TR/accname-1.1/#step2B
        `.//*[@aria-describedby=(//*[normalize-space(text()) = "${ label }"]/@id)]`,
        // element has direct aria label
        // https://www.w3.org/TR/accname-1.1/#step2C
        `.//*[@aria-label = "${ label }"]`,
        // inputs with a label
        // https://www.w3.org/TR/accname-1.1/#step2D
        `.//input[@id = (//label[normalize-space() = "${ label }"]/@for)]`,
        // aria label is received by an input placeholder
        // https://www.w3.org/TR/accname-1.1/#step2D
        `.//input[@placeholder="${ label }"]`,
        `.//textarea[@placeholder="${ label }"]`,
        // aria label is received by an input placeholder
        // https://www.w3.org/TR/accname-1.1/#step2D
        `.//input[@aria-placeholder="${ label }"]`,
        `.//textarea[@aria-placeholder="${ label }"]`,
        // aria label is received by its title attribute
        // https://www.w3.org/TR/accname-1.1/#step2D
        `.//*[@title="${ label }"]`,
        // images with an alt tag
        // https://www.w3.org/TR/accname-1.1/#step2D
        `.//img[@alt="${ label }"]`,
        // aria label is received from element content
        // https://www.w3.org/TR/accname-1.1/#step2G
        `.//*[normalize-space(text()) = "${ label }"]`
      ]
      using = 'xpath'
      value = conditions.join(' | ')
      break

    case '-android uiautomator':
      using = '-android uiautomator'
      value = selector.slice(8)
      break

    case '-android datamatcher':
      using = '-android datamatcher'
      value = JSON.stringify(value)
      break

    case '-android viewmatcher':
      using = '-android viewmatcher'
      value = JSON.stringify(value)
      break

    case '-ios uiautomation':
      using = '-ios uiautomation'
      value = selector.slice(4)
      break

    case 'accessibility id':
      using = 'accessibility id'
      value = selector.slice(1)
      break

    case 'class name':
      using = 'class name'
      break

    case 'tag name':
      using = 'tag name'
      value = selector.replace(/<|>|\/|\s/g, '')
      break

    case 'name':
      match = selector.match(/^\[name=("|')([a-zA-z0-9\-_.@=[\] ']+)("|')]$/)
      if (!match) {
        throw new Error(`InvalidSelectorMatch. Strategy 'name' has failed to match '${ selector }'`)
      }

      using = 'name'
      value = match[2]
      break

    case 'xpath extended':
      using = 'xpath'
      match = selector.match(new RegExp(XPATH_SELECTOR_REGEXP.map((rx) => rx.source).join('')))
      if (!match) {
        throw new Error(`InvalidSelectorMatch: Strategy 'xpath extended' has failed to match '${ selector }'`)
      }

      // eslint-disable-next-line no-case-declarations
      const PREFIX_NAME = {
        '.': 'class',
        '#': 'id'
      }
      conditions = []
      // eslint-disable-next-line no-case-declarations
      const [tag, prefix, name, attrName, attrValue, partial, query] = match.slice(1)
      if (prefix) {
        conditions.push(`contains(@${ PREFIX_NAME[prefix] }, "${ name }")`)
      }
      if (attrName) {
        conditions.push(attrValue ?
          `contains(@${ attrName }, "${ attrValue }")` :
          `@${ attrName }`)
      }
      conditions.push(partial ? `contains(., "${ query }")` : `normalize-space() = "${ query }"`)
      value = `.//${ tag || '*' }[${ conditions.join(' and ') }]`
      break

    case 'role':
      match = selector.match(/^\[role=(.+)\]/)
      if (!match) {
        throw new Error(`InvalidSelectorMatch. Strategy 'role' has failed to match '${ selector }'`)
      }
      using = 'css selector'
      // eslint-disable-next-line no-use-before-define
      value = createRoleBaseXpathSelector(match[1])
      break
  }

  return {
    using,
    value,
  }
}

const createRoleBaseXpathSelector = (role) => {
  const locatorArr = []
  roleElements.get(role)?.forEach((value) => {
    let locator,
        tagAttribute,
        tagAttributevalue

    const tagname = value.name
    if (value.attributes instanceof Array) {
      value.attributes.forEach((val) => {
        tagAttribute = val.name
        tagAttributevalue = val.value
      })
    }
    if (!tagAttribute) {
      locator = tagname
    } else if (!tagAttributevalue) {
      locator = `${ tagname }[${ tagAttribute }]`
    } else {
      locator = `${ tagname }[${ tagAttribute }="${ tagAttributevalue }"]`
    }
    locatorArr.push(locator)
  })
  let xpathLocator = `[role="${ role }"]`
  locatorArr.forEach((loc) => {
    xpathLocator += `,${ loc }`
  })
  return xpathLocator
}
