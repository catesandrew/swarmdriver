import reportportal from 'wdio-reportportal-reporter'
import RpService from 'wdio-reportportal-service'

import {
  existy,
  parseBool,
  parseString,
} from '../utils'

import {
  argPairParser,
} from './utils'

export const parseReportPortalSettings = (envs) => {
  return {
    ...(envs.REPORTPORTAL_TOKEN && {
      token: envs.REPORTPORTAL_TOKEN,
    }),
    // No default: ReportPortal is self-hosted, so the endpoint is always
    // deployment-specific. Set `REPORTPORTAL_ENDPOINT` to your instance's
    // `/api/v1` URL.
    ...(envs.REPORTPORTAL_ENDPOINT && {
      endpoint: envs.REPORTPORTAL_ENDPOINT,
    }),
    // Daily Smoke Suite, API Tests, Weekly Full Regression Suite, etc...
    ...(envs.REPORTPORTAL_LAUNCH && {
      launch: envs.REPORTPORTAL_LAUNCH,
    }),
    ...(envs.REPORTPORTAL_PROJECT && {
      project: envs.REPORTPORTAL_PROJECT,
    }),
    ...(envs.REPORTPORTAL_MODE ?
      {
        mode: envs.REPORTPORTAL_MODE,
      } :
      {
        mode: 'DEFAULT',
      }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_DEBUG', false)) && {
      debug: parseBool(envs, 'REPORTPORTAL_DEBUG', false),
    }),
    ...(envs.REPORTPORTAL_DESCRIPTION && {
      description: envs.REPORTPORTAL_DESCRIPTION,
    }),
    // argPairParser('--env dev --service abby-react --version 1.1.0')
    // => [{key: 'env', value: 'dev'}, {key: 'service', value: 'abby-react'}, {key: 'version', value: '1.1.0'}]
    ...(envs.REPORTPORTAL_ATTRIBUTES && {
      attributes: argPairParser(envs.REPORTPORTAL_ATTRIBUTES),
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_REPORT_SELENIUM_COMMANDS', false)) && {
      reportSeleniumCommands: parseBool(envs, 'REPORTPORTAL_REPORT_SELENIUM_COMMANDS', false),
    }),
    ...(parseString(envs, 'REPORTPORTAL_SELENIUM_COMMANDS_LOG_LEVEL', 'debug') && {
      seleniumCommandsLogLevel: envs.REPORTPORTAL_SELENIUM_COMMANDS_LOG_LEVEL,
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_AUTO_ATTACH_SCREENSHOTS', false)) && {
      autoAttachScreenshots: parseBool(envs, 'REPORTPORTAL_AUTO_ATTACH_SCREENSHOTS', false),
    }),
    ...(parseString(envs, 'REPORTPORTAL_SCREENSHOTS_LOG_LEVEL', 'info') && {
      screenshotsLogLevel: envs.REPORTPORTAL_SCREENSHOTS_LOG_LEVEL,
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_PARSE_TAGS_FROM_TEST_TITLE', false)) && {
      parseTagsFromTestTitle: parseBool(envs, 'REPORTPORTAL_PARSE_TAGS_FROM_TEST_TITLE', false),
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_CUCUMBER_NESTED_STEPS', false)) && {
      cucumberNestedSteps: parseBool(envs, 'REPORTPORTAL_CUCUMBER_NESTED_STEPS', false),
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_AUTO_ATTACH_CUCUMBER_FEATURE_TO_SCENARIO', false)) && {
      autoAttachCucumberFeatureToScenario: parseBool(envs, 'REPORTPORTAL_AUTO_ATTACH_CUCUMBER_FEATURE_TO_SCENARIO', false),
    }),
    ...(existy(parseBool(envs, 'REPORTPORTAL_SANITIZE_ERROR_MESSAGES', true)) && {
      sanitizeErrorMessages: parseBool(envs, 'REPORTPORTAL_SANITIZE_ERROR_MESSAGES', true),
    }),
  }
}

export const buildReportPortalSettings = (opts = {}) => {
  return {
    services: [
      [RpService, {
      }]
    ],
    reporters: [
      // In order to use the service you need to add `appium` to list of services
      [reportportal, {
        reportPortalClientConfig: { // report portal settings
          ...(opts.token && {
            token: opts.token,
          }),
          ...(opts.endpoint && {
            endpoint: opts.endpoint,
          }),
          // Daily Smoke Suite, API Tests, Weekly Full Regression Suite, etc...
          ...(opts.launch && {
            launch: opts.launch,
          }),
          ...(opts.project && {
            project: opts.project,
          }),
          ...(opts.mode && {
            mode: opts.mode,
          }),
          ...(existy(opts.debug) && {
            debug: opts.debug,
          }),
          ...(opts.description && {
            description: opts.description,
          }),
          ...(opts.attributes && {
            attributes: opts.attributes,
          }),
          // optional headers for internal http client
          ...(opts.headers && {
            headers: opts.headers,
          })
        },
        // add selenium commands to log
        ...(opts.reportSeleniumCommands && {
          reportSeleniumCommands: opts.reportSeleniumCommands,
        }),
        // log level for selenium commands
        ...(opts.seleniumCommandsLogLevel && {
          seleniumCommandsLogLevel: opts.seleniumCommandsLogLevel,
        }),
        // automatically add screenshots
        ...(opts.autoAttachScreenshots && {
          autoAttachScreenshots: opts.autoAttachScreenshots,
        }),
        // log level for screenshots
        ...(opts.screenshotsLogLevel && {
          screenshotsLogLevel: opts.screenshotsLogLevel,
        }),
        // parse strings like `@foo` from titles and add to Report Portal
        ...(opts.parseTagsFromTestTitle && {
          parseTagsFromTestTitle: opts.parseTagsFromTestTitle,
        }),
        // report cucumber steps as Report Portal steps
        ...(opts.cucumberNestedSteps && {
          cucumberNestedSteps: opts.cucumberNestedSteps,
        }),
        // requires cucumberNestedSteps to be true for use
        ...(opts.autoAttachCucumberFeatureToScenario && {
          autoAttachCucumberFeatureToScenario: opts.autoAttachCucumberFeatureToScenario,
        }),
        // strip color ascii characters from error stacktrace
        ...(opts.sanitizeErrorMessages && {
          sanitizeErrorMessages: opts.sanitizeErrorMessages,
        }),
        sauceLabOptions: {
          // automatically add SauseLab ID to rp tags.
          enabled: true,
          // automatically add SauseLab region to rp tags.
          sldc: 'US',
        },
      }]
    ],
  }
}

export const setupReportPortalConfig = ({
  envs,
  ...opts
} = {}) => {
  const values = parseReportPortalSettings(envs)
  return buildReportPortalSettings({
    ...values,
    ...opts,
  })
}
