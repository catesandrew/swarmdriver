#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sauceStorageApp } from '../dist/index.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.join(here, '../package.json'), 'utf8'))

// Makes the script crash on unhandled rejections instead of silently ignoring
// them. In the future, promise rejections that are not handled will terminate
// the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection', err)
})

// Plain `process.env` is the contract — bring your own dotenv loader if you
// want layered .env files.
sauceStorageApp({
  version: pkg.version,
  name: pkg.name,
  ...process.env,
})
