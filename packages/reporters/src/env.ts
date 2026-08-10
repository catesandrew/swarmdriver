import yn from 'yn'

/**
 * Environment-variable parsing primitives.
 *
 * These are a VERBATIM copy of the same-named exports in `@caps/core/utils`,
 * kept local so `@caps/reporters` stays a dependency-free leaf of the
 * workspace graph. `@caps/core/services/local.js` composes reporter configs,
 * so core depends on this package; importing core from here for these four
 * helpers would make the graph circular.
 *
 * Note the shared `retval !== def ? retval : undefined` idiom: returning
 * `undefined` when the parsed value equals the supplied default is what gives
 * callers "omit this key entirely" semantics when they spread the result.
 * Any change here must be mirrored in `@caps/core/utils` (and vice versa) —
 * consolidating the two behind a shared kernel is a follow-up for the
 * TypeScript wave.
 */

/** Loosely-typed environment map, e.g. `process.env`. */
export type EnvRecord = Record<string, string | undefined>

export const existy = (x: unknown): boolean => x != null

export const parseBool = (
  envs: EnvRecord,
  key: string,
  def: boolean
): boolean | undefined => {
  const retval = existy(envs[key]) ?
    yn(envs[key]) :
    def

  return retval !== def ? retval : undefined
}

export const parseWhole = (
  envs: EnvRecord,
  key: string,
  def: number
): number | undefined => {
  const retval = existy(envs[key]) ?
    parseInt(envs[key] as string, 10) || def :
    def

  return retval !== def ? retval : undefined
}

export const parseString = (
  envs: EnvRecord,
  key: string,
  def: string
): string | undefined => {
  const retval = existy(envs[key]) ?
    String(envs[key]) :
    def

  return retval !== def ? retval : undefined
}
