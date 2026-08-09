# Swarmdriver

[![GitHub](https://img.shields.io/badge/github-catesandrew%2Fswarmdriver-blue?style=flat-square&logo=github)](https://github.com/catesandrew/swarmdriver)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

An environment-variable-driven **WebdriverIO + Appium test harness** for cross-device and cross-simulator mobile and web testing. Swarmdriver provides a curated collection of WebdriverIO packages and configurations that make `wdio.conf.js` manageable and testable across multiple platforms and cloud providers.

## ✨ Why Swarmdriver?

- **Environment-driven**: Control your entire test matrix through environment variables—no code changes needed
- **Platform agnostic**: Run tests locally, on Sauce Labs, or any pluggable cloud provider
- **Cross-scope**: Test web browsers and native mobile apps from the same configuration
- **Cross-device**: Desktop, device, and simulator testing in one harness
- **Page Object Pattern**: Built-in support for clean, maintainable test code
- **Zero magic**: Simple matrix configuration (3 axes, 8 core configurations)

## 🚀 Quick Start

### Installation

```bash
npm install --save-dev swarmdriver webdriverio appium
```

### Create `wdio.conf.js`

```javascript
import { buildWdioConfig } from 'swarmdriver'

const config = buildWdioConfig({
  envs: process.env,
  remote: process.env.WDIO_REMOTE || 'local',
  scope: process.env.WDIO_SCOPE || 'browser',
  metal: process.env.WDIO_METAL || 'desktop',
  framework: 'jasmine',
})

export default config
```

### Run Tests

```bash
# Desktop browser (default)
wdio

# Mobile device browser
WDIO_METAL=device wdio

# Native app testing
WDIO_SCOPE=app wdio

# Cloud testing (Sauce Labs)
WDIO_REMOTE=saucelabs wdio
```

## 📊 Configuration Matrix

Swarmdriver's core concept is a simple 3-axis configuration matrix:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Test Configuration                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  WDIO_REMOTE: local ────────────────────────┐                       │
│                          ┌──────────────────┴──────────────────┐    │
│                          │                                     │    │
│                   WDIO_SCOPE: browser                   WDIO_SCOPE: app
│                    ┌──────────┴──────────┐                     │    │
│                    │                     │                     │    │
│            WDIO_METAL: desktop    WDIO_METAL: device    │    │    │
│            (Chrome/Safari)        (Mobile devices)     │    │    │
│                    │                     │                     │    │
└─────────────────────────────────────────────────────────────────────┘

WDIO_REMOTE: saucelabs ────────────────────────┐
                          ┌──────────────────┴──────────────────┐
                          │                                     │
                   WDIO_SCOPE: browser                   WDIO_SCOPE: app
                    ┌──────────┴──────────┐                     │
                    │                     │                     │
            WDIO_METAL: desktop    WDIO_METAL: device    │
            (Cloud browsers)       (Cloud mobile)        │
```

| Axis | Options | Purpose |
|------|---------|---------|
| **WDIO_REMOTE** | `local` \| `saucelabs` | Where tests run |
| **WDIO_SCOPE** | `browser` \| `app` | What to test (web or native) |
| **WDIO_METAL** | `desktop` \| `device` | Physical target (desktop or mobile) |

This gives you **8 core configurations** with sensible defaults for drivers, browsers, devices, and capabilities.

## 🛠️ Core Features

### Environment-Driven Configuration

Every aspect of your test setup is configurable via environment variables:

```bash
# Logging
SWARMDRIVER_LOG_LEVEL=debug wdio

# Custom host/port
HOST=127.0.0.1 PORT=3000 wdio

# Multiple browsers
WDIO_BROWSERS=chrome:firefox:edge wdio

# Sauce Labs credentials
SAUCE_USERNAME=user SAUCE_ACCESS_KEY=key WDIO_REMOTE=saucelabs wdio
```

### Page Object Pattern

Organize tests cleanly with page objects:

```javascript
// test/pages/login.page.js
class LoginPage {
  get emailField() { return $('input[type="email"]') }
  get passwordField() { return $('input[type="password"]') }
  
  async login(email, password) {
    await this.emailField.setValue(email)
    await this.passwordField.setValue(password)
    await $('button[type="submit"]').click()
  }
}
export default new LoginPage()
```

```javascript
// test/specs/auth.spec.js
import LoginPage from '../pages/login.page.js'

describe('Authentication', () => {
  it('should log in', async () => {
    await browser.url('https://app.example.com/login')
    await LoginPage.login('user@example.com', 'password')
    expect(await browser.getUrl()).toContain('/dashboard')
  })
})
```

### Cloud Provider Support

**Sauce Labs** is included as a reference implementation. Other cloud providers (BrowserStack, LambdaTest, etc.) can be implemented via the provider interface.

```bash
# Sauce Labs - included
WDIO_REMOTE=saucelabs wdio

# Custom providers coming soon
WDIO_REMOTE=browserstack wdio
WDIO_REMOTE=lambdatest wdio
```

## 📖 Documentation

Full documentation is available in the [`docs/`](./docs/) directory:

- **[Intro](./docs/intro.mdx)** — Overview and core concepts
- **[Installation](./docs/installation.mdx)** — Setup and dependencies
- **[Quick Start](./docs/quick-start.mdx)** — First test in 5 minutes
- **[Usage](./docs/usage.mdx)** — Environment variables, examples, best practices
- **[API Reference](./docs/api/)** — Complete API documentation

## 🔧 Usage Examples

### Local Desktop Browser Testing

```bash
# Default configuration (Chrome on localhost:4000)
wdio

# Multiple browsers in parallel
WDIO_BROWSERS=chrome:firefox:edge wdio

# With debugging
SWARMDRIVER_LOG_LEVEL=debug wdio
```

### Mobile Device Testing

```bash
# Local simulator/emulator
WDIO_METAL=device wdio

# Cloud mobile browsers
WDIO_REMOTE=saucelabs WDIO_METAL=device wdio
```

### Native App Testing

```bash
# Local Appium
WDIO_SCOPE=app wdio

# Cloud native apps
WDIO_REMOTE=saucelabs WDIO_SCOPE=app wdio
```

### Integration with Custom Server

```bash
# Use custom host and port
HOST=localhost PORT=5000 wdio

# Or via environment fallback
SWARMDRIVER_HOST=localhost SWARMDRIVER_PORT=5000 wdio
```

## 🌍 Environment Variables

### Configuration Matrix (Required)

| Variable | Values | Default |
|----------|--------|---------|
| `WDIO_REMOTE` | `local` \| `saucelabs` | `local` |
| `WDIO_SCOPE` | `browser` \| `app` | `browser` |
| `WDIO_METAL` | `desktop` \| `device` | `desktop` |

### Logging (Optional)

| Variable | Default |
|----------|---------|
| `SWARMDRIVER_LOG_LEVEL` | `warn` |
| `WDIO_LOGLEVEL` | `error` |

### Server Configuration (Optional)

| Variable | Default |
|----------|---------|
| `PORT` | `4000` (via process.env first) |
| `HOST` | `0.0.0.0` (via process.env first) |
| `SWARMDRIVER_PORT` | (fallback only) |
| `SWARMDRIVER_HOST` | (fallback only) |

### Cloud Provider Credentials (When Using saucelabs)

| Variable | Required |
|----------|----------|
| `SAUCE_USERNAME` | Yes |
| `SAUCE_ACCESS_KEY` | Yes |
| `SAUCE_REGION` | Optional (default: us-west-1) |

See [Usage](./docs/usage.mdx) for complete environment variable reference.

## 📋 Example Test

```javascript
describe('Google Search', () => {
  beforeEach(async () => {
    await browser.url('https://www.google.com')
  })

  it('should find Swarmdriver on GitHub', async () => {
    const searchBox = await $('input[name="q"]')
    await searchBox.setValue('swarmdriver')
    await searchBox.keys(['Enter'])
    
    // Wait for search results
    await browser.waitUntil(async () => {
      const results = await $$('a')
      return results.length > 0
    }, { timeout: 5000 })

    const githubLink = await $('a[href*="github.com/catesandrew/swarmdriver"]')
    expect(githubLink).toBeDefined()
  })

  it('should work with different browsers', async () => {
    // Automatically runs with WDIO_BROWSERS=chrome:firefox:edge
    const title = await browser.getTitle()
    expect(title).toContain('Google')
  })
})
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/catesandrew/swarmdriver).

## 📝 License

MIT © [Andrew Cates](https://github.com/catesandrew)

## Provenance

Swarmdriver is derived from an internal HappyMoney test harness (`wdio-happy`), released as MIT-licensed open source software with permission. The core architectural patterns and configuration matrix approach have been preserved and extended for general-purpose use.

---

**Ready to get started?** Check out the [Quick Start](./docs/quick-start.mdx) guide or explore the full [documentation](./docs/).

Have questions? Open an issue on [GitHub](https://github.com/catesandrew/swarmdriver/issues).
