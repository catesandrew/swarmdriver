import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes as prismThemes } from 'prism-react-renderer'

/**
 * The docs content is NOT stored under `site/`. It lives in the repo-root
 * `docs/` tree, which is also where `pnpm build-docs` (TypeDoc) writes the
 * generated API reference into `docs/api/`. Pointing the docs plugin at
 * `../docs` keeps a single source of truth: the generator, the hand-written
 * `.mdx` pages, and the sidebar definitions all stay where they already are,
 * and this package is purely the renderer.
 */
const config: Config = {
  title: 'swarmdriver',
  tagline: 'One config. Every target.',

  url: 'https://catesandrew.github.io',
  baseUrl: '/swarmdriver/',
  organizationName: 'catesandrew',
  projectName: 'swarmdriver',

  // The docs tree is edited concurrently and contains generated TypeDoc output,
  // so a dangling cross-reference should surface as a warning rather than take
  // the whole deploy down.
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  markdown: {
    // `detect` parses `.mdx` as MDX and `.md` as CommonMark. This matters: the
    // hand-written pages are `.mdx` and use `<Tabs>`, but TypeDoc emits plain
    // `.md` into `docs/api/` where a type signature such as `Map<string,
    // EventEmitter>` would otherwise be read as an undefined JSX component and
    // fail the static render.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Relative paths are resolved against this site directory.
          path: '../docs',
          routeBasePath: 'docs',
          sidebarPath: '../docs/sidebars.cjs',
          editUrl: 'https://github.com/catesandrew/swarmdriver/tree/main/',
          showLastUpdateTime: false,
          // `docs/sidebars.cjs` autogenerates from `.` *and* appends an
          // explicit `API` category built from `docs/sidebars-api.cjs`. Since
          // `docs/api/` lives inside `docs/`, the `.` scan picks the generated
          // reference up as well and the whole TypeDoc tree renders twice.
          // Drop it from the top-level scan only; the `api` scan that backs the
          // curated `API` category is left untouched.
          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
            const items = await defaultSidebarItemsGenerator(args)

            if (args.item.dirName !== '.') {
              return items
            }

            return items.filter((item) => {
              if (item.type === 'category') {
                return !(item.link?.type === 'doc' && item.link.id.startsWith('api/'))
              }
              if (item.type === 'doc') {
                return !item.id.startsWith('api/')
              }
              return true
            })
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'swarmdriver',
      items: [
        { to: '/docs/intro', label: 'Docs', position: 'left' },
        { to: '/docs/quick-start', label: 'Quick Start', position: 'left' },
        {
          href: 'https://github.com/catesandrew/swarmdriver',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Quick Start', to: '/docs/quick-start' },
            { label: 'Usage', to: '/docs/usage' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/catesandrew/swarmdriver',
            },
            {
              label: 'Issues',
              href: 'https://github.com/catesandrew/swarmdriver/issues',
            },
          ],
        },
      ],
      copyright: `MIT licensed. Copyright © ${ new Date().getFullYear() } Andrew Cates.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
