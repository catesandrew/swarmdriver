import CodeBlock from '@theme/CodeBlock'
import Heading from '@theme/Heading'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import type { ReactNode } from 'react'

import styles from './index.module.css'

/**
 * The config below is the real `buildWdioConfig()` call signature from
 * `packages/core/src/api.ts` — `envs`, `remote`, `scope`, `metal`, `framework`.
 * The bare `@caps/providers` import is load-bearing: it registers the cloud
 * providers, and without it `remote: 'saucelabs'` resolves to nothing.
 */
const CONFIG_SNIPPET = `// wdio.conf.js
import '@caps/providers'
import { buildWdioConfig } from '@caps/core'

export default buildWdioConfig({
  envs: process.env,
  remote: process.env.WDIO_REMOTE || 'local',    // local | saucelabs
  scope: process.env.WDIO_SCOPE || 'browser',    // browser | app
  metal: process.env.WDIO_METAL || 'desktop',    // desktop | device
  framework: 'jasmine',
})`

const SHELL_SNIPPET = `# desktop browsers, locally
wdio run wdio.conf.js

# mobile browsers on local simulators
WDIO_METAL=device wdio run wdio.conf.js

# the native app, on the Sauce Labs grid
WDIO_REMOTE=saucelabs WDIO_SCOPE=app wdio run wdio.conf.js`

type Feature = {
  title: string
  body: string
}

const FEATURES: Feature[] = [
  {
    title: 'One config. Every target.',
    body: 'remote x scope x metal picks the cell. Capabilities, services, and reporters are derived — not hand-maintained.',
  },
  {
    title: 'Local and cloud, same file.',
    body: 'Flip one variable. Tunnel names, build identifiers, and grid-specific capabilities are applied for you.',
  },
  {
    title: 'Browser or native app.',
    body: 'Desktop browsers, mobile web on simulators and real devices, and Appium native apps share a single entry point.',
  },
  {
    title: 'Providers are pluggable.',
    body: 'Sauce Labs ships in the box. Register another grid against the same interface and every cell keeps working.',
  },
]

function Hero(): ReactNode {
  return (
    <header className={ styles.hero }>
      <div className={ styles.heroInner }>
        <div className={ styles.heroCopy }>
          <Heading as="h1" className={ styles.title }>
            One config.
            <br />
            Every target.
          </Heading>
          <p className={ styles.subtitle }>
            Env-var-driven WebdriverIO + Appium capabilities. Local simulator,
            real device, or cloud grid — browser or native app — out of the same{ ' ' }
            <code>wdio.conf.js</code>.
          </p>
          <div className={ styles.actions }>
            <Link className="button button--primary button--lg" to="/docs/quick-start">
              Get Started
            </Link>
            <Link
              className="button button--secondary button--outline button--lg"
              to="/docs/intro"
            >
              Read the Docs
            </Link>
          </div>
        </div>

        <div className={ styles.heroCode }>
          <CodeBlock language="javascript">{ CONFIG_SNIPPET }</CodeBlock>
        </div>
      </div>
    </header>
  )
}

function Features(): ReactNode {
  return (
    <section className={ styles.section }>
      <div className={ styles.featureGrid }>
        { FEATURES.map((feature) => (
          <div key={ feature.title } className={ styles.feature }>
            <Heading as="h3" className={ styles.featureTitle }>
              { feature.title }
            </Heading>
            <p className={ styles.featureBody }>{ feature.body }</p>
          </div>
        )) }
      </div>
    </section>
  )
}

function Matrix(): ReactNode {
  return (
    <section className={ styles.section }>
      <div className={ styles.matrix }>
        <div className={ styles.matrixCopy }>
          <Heading as="h2" className={ styles.matrixTitle }>
            The same suite, everywhere.
          </Heading>
          <p className={ styles.matrixBody }>
            Your specs never change. The environment decides where they run.
          </p>
        </div>
        <div className={ styles.matrixCode }>
          <CodeBlock language="bash">{ SHELL_SNIPPET }</CodeBlock>
        </div>
      </div>
    </section>
  )
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="One config. Every target."
      description="Env-var-driven WebdriverIO and Appium config generation for local, device, and cloud test runs."
    >
      <main>
        <Hero />
        <Features />
        <Matrix />
      </main>
    </Layout>
  )
}
