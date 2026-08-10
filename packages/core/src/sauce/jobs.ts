import { existy } from '../utils'

import {
  sauceAuthorization,
  sauceJobsAPI,
  sauceRealDevicesAPI,
} from './api'

/**
 * Sauce Labs Jobs REST client.
 *
 * These are deliberately *data* functions: they perform the HTTP call and
 * return the parsed response untouched. Projecting a response down to a
 * human-readable subset and rendering it as JSON/YAML is a presentation
 * concern and stays in `@caps/cli`; a test session calling
 * `browser.updateJob()` wants the object, not a pretty-printed string.
 *
 * Uses the runtime's global `fetch` (Node >= 18, and this package requires
 * >= 20) so `@caps/core` picks up no HTTP dependency of its own.
 */

/**
 * Credentials and target selection shared by every Jobs API call.
 *
 * `isRealDevice` switches between the virtual-machine jobs API and the real
 * device cloud API, which are different endpoints with different response
 * envelopes.
 */
export interface SauceJobCredentials {
  sauceUsername: string
  sauceAccessKey: string
  sauceRegion: string
  isRealDevice?: boolean
}

/** The mutable fields a job `PUT` can update. */
export interface SauceJobUpdate {
  /** A new name for the job. */
  name?: string
  /** The set of distinguishing tags to apply to the job. */
  tags?: string[]
  /** Specifies the level of visibility permitted for the job. */
  visibility?: string
  /** Asserts whether the job passed (`true`) or not (`false`). */
  passed?: boolean
  /** Assign the job to a build. An existing build name, or a new one. */
  build?: string
  /** Any relevant attributes you wish to add to the job details. */
  customData?: unknown
}

export interface UpdateSauceJobOptions extends SauceJobCredentials, SauceJobUpdate {}

/** Pagination/filter parameters accepted by {@link listSauceJobs}. */
export interface ListSauceJobsOptions extends SauceJobCredentials {
  /** The maximum number of jobs to return. */
  limit?: number
  /** Return only the jobs beginning after this index number. */
  skip?: number
  /** Return only jobs that ran on or after this Unix timestamp. (VM jobs only.) */
  from?: number
  /** Return only jobs that ran on or before this Unix timestamp. (VM jobs only.) */
  to?: number
}

/**
 * The fields consumers actually read off a Sauce Labs job / real-device-job
 * REST response. Deliberately loose (not a full Sauce API client type) — the
 * response carries considerably more, and `verbose` callers get the whole
 * object back regardless.
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

/** A single entry of a jobs listing — only the id is guaranteed. */
export interface SauceJobSummary {
  id: string
}

/** The real device cloud wraps its listing in an `entities` envelope. */
export interface SauceRealDeviceListResponse {
  entities: SauceJobSummary[]
}

const jobUrl = (id: string, {
  sauceUsername,
  sauceRegion,
  isRealDevice = false,
}: SauceJobCredentials): URL => {
  return new URL(isRealDevice ?
    sauceRealDevicesAPI(sauceRegion, `jobs/${ id }`) :
    sauceJobsAPI(sauceRegion, sauceUsername, id))
}

/** Fetch a single job's details. */
export const getSauceJob = async (id: string, opts: SauceJobCredentials): Promise<SauceJobResponse> => {
  const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
  const url = jobUrl(id, opts)

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${ authorization }`,
      Accept: 'application/json',
    },
  })

  return res.json() as Promise<SauceJobResponse>
}

/**
 * Update a job's metadata. Only the fields present in `opts` are sent, so a
 * caller can flip `passed` without clobbering the job's name or tags.
 *
 * `passed` goes through `existy` rather than a truthiness check because
 * `passed: false` is a meaningful value that must still be transmitted.
 */
export const updateSauceJob = async (id: string, opts: UpdateSauceJobOptions): Promise<SauceJobResponse> => {
  const {
    name,
    tags,
    visibility,
    passed,
    build,
    customData,
  } = opts

  const authorization = sauceAuthorization(opts.sauceUsername, opts.sauceAccessKey)
  const url = jobUrl(id, opts)

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${ authorization }`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...(name && {
        name,
      }),
      ...(tags && {
        tags,
      }),
      ...(visibility && {
        public: visibility,
      }),
      ...(existy(passed) && {
        passed,
      }),
      ...(build && {
        build,
      }),
      ...(customData && {
        'custom-data': customData,
      }),
    }),
  })

  return res.json() as Promise<SauceJobResponse>
}

/**
 * List recent jobs for the authenticated user.
 *
 * The two endpoints disagree on both their query parameters (`from`/`to` are
 * VM-only) and their response shape, so the return type is a union the caller
 * narrows on the `isRealDevice` it passed in.
 */
export const listSauceJobs = async (opts: ListSauceJobsOptions): Promise<SauceRealDeviceListResponse | SauceJobSummary[]> => {
  const {
    sauceUsername,
    sauceAccessKey,
    sauceRegion,
    isRealDevice = false,
    limit,
    skip,
    from,
    to,
  } = opts

  const authorization = sauceAuthorization(sauceUsername, sauceAccessKey)

  let url: URL
  if (isRealDevice) {
    url = new URL(sauceRealDevicesAPI(sauceRegion, 'jobs'))

    const params = url.searchParams
    if (limit) {
      params.append('limit', String(limit))
    }

    if (skip) {
      params.append('skip', String(skip))
    }
  } else {
    url = new URL(sauceJobsAPI(sauceRegion, sauceUsername, ''))

    const params = url.searchParams
    if (limit) {
      params.append('limit', String(limit))
    }

    if (skip) {
      params.append('skip', String(skip))
    }

    if (from) {
      params.append('from', String(from))
    }

    if (to) {
      params.append('to', String(to))
    }

    params.append('format', 'json')
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${ authorization }`,
      Accept: 'application/json',
    },
  })

  return res.json() as Promise<SauceRealDeviceListResponse | SauceJobSummary[]>
}
