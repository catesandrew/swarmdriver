import { createRequire } from 'node:module'

const _resolve = createRequire(import.meta.url).resolve
export default _resolve
