import type { OutputFormat } from '../utils'

/**
 * Shared shape of the Sauce Labs credential/display flags every `jobs`
 * subcommand accepts (via `SauceCommand`'s global options plus `--real`).
 */
export interface JobLookupOptions {
  sauceUsername: string
  sauceAccessKey: string
  sauceRegion: string
  isRealDevice?: boolean
  verbose?: boolean
  color?: boolean
  output?: OutputFormat
}

/**
 * Fields this CLI actually reads off a Sauce Labs job/real-device-job REST
 * response. Deliberately loose (not a full Sauce API client type) — only
 * what `info`/`edit` project onto their own output shape.
 */
export interface SauceJobResponse {
  id: string
  status?: string
  name?: string
  passed?: boolean
  owner?: string
  browser?: string
  browser_version?: string
  os?: string
  os_version?: string
  device_name?: string
  start_time: number
  end_time: number
  tags?: string[]
  log_url?: string
  video_url?: string
  error?: string
  build?: string
  public?: string
  'custom-data'?: unknown
  remote_app_file_url?: string
  framework_log_url?: string
  device_log_url?: string
  requests_url?: string
  test_cases_url?: string
  screenshots?: string[]
}

/** Options accepted by `edit()` — `JobLookupOptions` plus the mutable fields
 * a `PUT` can update. */
export interface EditJobOptions extends JobLookupOptions {
  // A new name for the job.
  name?: string
  // The set of distinguishing tags to apply to the job.
  tags?: string[]
  // Specifies the level of visibility permitted for the job.
  visibility?: string
  // Asserts whether the job passed (`true`) or not (`false`).
  passed?: boolean
  // Assign the job to a build. You can specify an existing build name or create a new one.
  build?: string
  // Any relevant attributes you wish to add to the job details.
  customData?: unknown
}
