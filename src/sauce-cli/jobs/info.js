import fetch from 'node-fetch'

import {
  outputColor,
  sauceAuthorization,
  sauceJobsAPI,
  sauceRealDevicesAPI,
  toHHMMSS,
} from '../utils'

export const info = async (id, {
  sauceUsername,
  sauceAccessKey,
  sauceRegion,
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
    method: 'GET',
    headers: {
      Authorization: `Basic ${ authorization }`,
      Accept: 'application/json',
    }
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
        durationn: toHHMMSS(json.end_time - json.start_time),
        sauceApp: json.remote_app_file_url,
        ...(json.tags.length && {
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
      durationn: toHHMMSS(json.end_time - json.start_time),
      ...(json.tags.length && {
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

export const infoCommand = (program) => {
  const cmd = program.command('info <id>')
  cmd
  .description('Get information about a specific job running on a real device at the data center.')
  .option('--real', 'Query jobs running on real devices.')
  .action(async (id) => {
    const opts = cmd.opts()

    return info(id, {
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

  Get info on a job id
  $ ${ program.name() } ${ cmd.name() } <id>

  Get info on a real device job id
  $ ${ program.name() } ${ cmd.name() } --real <id>`)
}
