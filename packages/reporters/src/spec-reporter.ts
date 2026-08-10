import {
  existy,
  parseBool,
  type EnvRecord,
} from './env'

export interface SpecSettings {
  sauceLabsSharableLinks?: boolean
  onlyFailures?: boolean
  addConsoleLogs?: boolean
  realtimeReporting?: boolean
  showPreface?: boolean
}

export interface SpecReporterConfig {
  reporters: [string, Record<string, unknown>][]
}

export const parseSpecSettings = (envs: EnvRecord): SpecSettings => {
  return {
    ...(existy(parseBool(envs, 'SPEC_REPORTER_SAUCE_LABS_SHARABLE_LINKS', true)) && {
      sauceLabsSharableLinks: parseBool(envs, 'SPEC_REPORTER_SAUCE_LABS_SHARABLE_LINKS', true)
    }),
    ...(existy(parseBool(envs, 'SPEC_REPORTER_ONLY_FAILURES', false)) && {
      onlyFailures: parseBool(envs, 'SPEC_REPORTER_ONLY_FAILURES', false)
    }),
    ...(existy(parseBool(envs, 'SPEC_REPORTER_ADD_CONSOLE_LOGS', false)) && {
      addConsoleLogs: parseBool(envs, 'SPEC_REPORTER_ADD_CONSOLE_LOGS', false)
    }),
    ...(existy(parseBool(envs, 'SPEC_REPORTER_REALTIME_REPORTING', false)) && {
      realtimeReporting: parseBool(envs, 'SPEC_REPORTER_REALTIME_REPORTING', false)
    }),
    ...(existy(parseBool(envs, 'SPEC_REPORTER_SHOW_PREFACE', true)) && {
      showPreface: parseBool(envs, 'SPEC_REPORTER_SHOW_PREFACE', true)
    }),
  }
}

export const buildSpecSettings = (opts: SpecSettings = {}): SpecReporterConfig => {
  return {
    reporters: [
      // In order to use the service you need to add `appium` to list of services
      ['spec', {
        // By default the test results in Sauce Labs can only be viewed by a
        // team member from the same team, not by a team member from a different
        // team. This options will enable
        // [sharable links](https://wiki.saucelabs.com/display/DOCS/Building+Sharable+Links+to+Test+Results)
        // by default, which means that all tests that are executed in Sauce
        // Labs can be viewed by everybody. Just add `sauceLabsSharableLinks:
        // false`, as shown below, in the reporter options to disable this
        // feature.
        ...(existy(opts.sauceLabsSharableLinks) && {
          sauceLabsSharableLinks: opts.sauceLabsSharableLinks,
        }),

        // Print only failed specs results.
        ...(existy(opts.onlyFailures) && {
          onlyFailures: opts.onlyFailures,
        }),

        // Set to true to show console logs from steps in final report
        ...(existy(opts.addConsoleLogs) && {
          addConsoleLogs: opts.addConsoleLogs,
        }),

        // Set to true to display test status realtime than just at the end of the run
        ...(existy(opts.realtimeReporting) && {
          realtimeReporting: opts.realtimeReporting,
        }),

        // Set to false to disable `[ MutliRemoteBrowser ... ]` preface in the reports.
        ...(existy(opts.showPreface) && {
          showPreface: opts.showPreface,
        }),

        // Provide custom symbols for `passed`, `failed` and or `skipped` tests
        symbols: {
          passed: '✓',
          skipped: '-',
          failed: '✖',
        }
      }]
    ],
  }
}

export const setupSpecConfig = ({
  envs,
  ...opts
}: { envs: EnvRecord } & SpecSettings): SpecReporterConfig => {
  const values = parseSpecSettings(envs)
  return buildSpecSettings({
    ...values,
    ...opts,
  })
}
