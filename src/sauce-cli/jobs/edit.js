import fetch from 'node-fetch'

import {
  outputColor,
  sauceAuthorization,
  sauceJobsAPI,
  sauceRealDevicesAPI,
} from '../utils'

import {
  existy,
} from '../../utils'

export const edit = async (id, {
  sauceUsername,
  sauceAccessKey,
  sauceRegion,
  // A new name for the job.
  name,
  // The set of distinguishing tags to apply to the job.
  tags,
  // Specifies the level of visibility permitted for the job.
  visibility,
  // Asserts whether the job passed (`true`) or not (`false`).
  passed,
  // Assign the job to a build. You can specify an existing build name or create a new one.
  build,
  // Any relevant attributes you wish to add to the job details.
  customData,
  isRealDevice = false,
  verbose = false,
  color = false,
  output = 'json',
} = {}) => {
  const authorization = sauceAuthorization(sauceUsername, sauceAccessKey)

  let url
  if (isRealDevice) {
    const apiUrl = sauceRealDevicesAPI(sauceRegion, `jobs/${ id }`)
    url = new URL(apiUrl)
  } else {
    const apiUrl = sauceJobsAPI(sauceRegion, sauceUsername, id)
    url = new URL(apiUrl)
  }

  return fetch(url.toString(), {
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
    })
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    if (verbose) {
      return outputColor(json, {
        color,
        output,
      })
    }

    if (isRealDevice) {
      return outputColor({
        testId: json.id,
        status: json.status,
        name: json.name,
        device: `${ json.os } v${ json.os_version } - ${ json.device_name }`,
        started: new Date(json.start_time).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        }),
        sauceApp: json.remote_app_file_url,
        ...(json.tags && json.tags.length && {
          tags: json.tags.join(', '),
        }),
        testResults: `https://app.saucelabs.com/tests/${ json.id }`,
        appiumLogs: json.framework_log_url,
        deviceLogs: json.device_log_url,
        appiumRequests: json.requests_url,
        ...(json.video_url && {
          video: json.video_url,
        }),
        ...(json.test_cases_url && {
          testCases: json.test_cases_url,
        }),
        ...(json.screenshots.length && {
          screenshots: json.screenshots,
        }),
        ...(json.error && {
          error: json.error,
        }),
        ...(json['custom-data'] && {
          customData: json['custom-data'],
        }),
      }, {
        color,
        output,
      })
    }

    return outputColor({
      testId: json.id,
      status: json.status,
      passed: json.passed,
      name: json.name,
      owner: json.owner,
      browser: `${ json.browser } v${ json.browser_version } - ${ json.os }`,
      started: new Date(json.start_time).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      }),
      ...(json.tags && json.tags.length && {
        tags: json.tags.join(', '),
      }),
      testResults: `https://app.saucelabs.com/tests/${ json.id }`,
      logs: json.log_url,
      ...(json.video_url && {
        video: json.video_url,
      }),
      ...(json.error && {
        error: json.error,
      }),
      ...(json.build && {
        build: json.build,
      }),
      ...(json.public && {
        public: json.public,
      }),
      ...(json['custom-data'] && {
        customData: json['custom-data'],
      }),
    }, {
      color,
      output,
    })
  })
}

export const editCommand = (program) => {
  const cmd = program.command('edit <id>')
  cmd
  .description('Update information about a specific job.')
  .option('--real', 'Query jobs running on real devices.')
  .action(async (id) => {
    const opts = cmd.opts()

    return edit(id, {
      isRealDevice: opts.real,
      ...opts,
    })
    .then((result) => {
      if (opts.silent) {
        return
      }

      return console.log(result)
    })
  })
  .addHelpText('after', `
Examples:

  Update info on a job id
  $ ${ program.name() } ${ cmd.name() } <id>

  Update info on a real device job id
  $ ${ program.name() } ${ cmd.name() } --real <id>`)
}
