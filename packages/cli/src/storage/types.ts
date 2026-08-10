import type { OutputFormat } from '../utils'

/**
 * Shared shape of the Sauce Labs credential/display flags every `storage`
 * subcommand accepts via `SauceCommand`'s global options.
 */
export interface StorageCredentialOptions {
  sauceUsername: string
  sauceAccessKey: string
  sauceRegion: string
  verbose?: boolean
  silent?: boolean
  color?: boolean
  output?: OutputFormat
}

/**
 * Fields this CLI actually reads off a Sauce Storage file/group item.
 * Deliberately loose (not a full Sauce API client type).
 */
export interface SauceStorageItem {
  id: string
  owner?: {
    id: string
    org_id?: string
  }
  name?: string
  upload_timestamp?: number
  etag?: string
  kind?: string
  group_id?: number
  description?: string | null
  identifier?: string
  metadata?: {
    icon?: unknown
    [key: string]: unknown
  }
  recent?: {
    metadata?: {
      icon?: unknown
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  access?: {
    team_ids?: string[]
    org_ids?: string[]
  }
}

export interface SauceStorageItemResponse {
  item: SauceStorageItem
}

export interface SauceStorageListResponse {
  items: SauceStorageItem[]
}
