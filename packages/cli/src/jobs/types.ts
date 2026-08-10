import type { SauceJobCredentials, SauceJobUpdate } from '@caps/core/sauce'

import type { OutputFormat } from '../utils'

/**
 * The REST-facing types (`SauceJobCredentials`, `SauceJobUpdate`,
 * `SauceJobResponse`) live in `@caps/core/sauce` alongside the client that
 * uses them. Re-exported so `@caps/cli/jobs` consumers keep naming them from
 * here.
 */
export type {
  SauceJobCredentials,
  SauceJobResponse,
  SauceJobSummary,
  SauceJobUpdate,
  SauceRealDeviceListResponse,
} from '@caps/core/sauce'

/**
 * Display-only flags every `jobs` subcommand accepts on top of the credentials
 * the REST client needs (via `SauceCommand`'s global options plus `--real`).
 */
export interface JobDisplayOptions {
  verbose?: boolean
  color?: boolean
  output?: OutputFormat
}

/** Credentials plus the display flags — what `info()` accepts. */
export interface JobLookupOptions extends SauceJobCredentials, JobDisplayOptions {}

/** `JobLookupOptions` plus the mutable fields a `PUT` can update. */
export interface EditJobOptions extends JobLookupOptions, SauceJobUpdate {}

/** `JobLookupOptions` plus the listing's pagination/filter parameters. */
export interface ListJobsOptions extends JobLookupOptions {
  /** The maximum number of jobs to return. */
  limit?: number
  /** Return only the jobs beginning after this index number. */
  skip?: number
  /** Return only jobs that ran on or after this Unix timestamp. */
  from?: number
  /** Return only jobs that ran on or before this Unix timestamp. */
  to?: number
}
