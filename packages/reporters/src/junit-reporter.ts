import {
  existy,
  parseBool,
  type EnvRecord,
} from './env'

export interface JunitSettings {
  outputDir: string
  suiteNameFormat: RegExp
  addFileAttribute?: boolean
  packageName?: string
}

export interface JunitReporterOptions extends Partial<JunitSettings> {
  outputFileFormat?: (options: { cid: string }) => string
}

export interface JunitReporterConfig {
  reporters: [string, Record<string, unknown>][]
}

export const parseJunitSettings = (envs: EnvRecord): JunitSettings => {
  return {
    ...(existy(envs.JUNIT_REPORTER_OUTPUT_DIR) ?
      {
        outputDir: envs.JUNIT_REPORTER_OUTPUT_DIR as string,
      } :
      {
        outputDir: './',
      }),
    ...(envs.JUNIT_REPORTER_SUITE_NAME_FORMAT ?
      {
        suiteNameFormat: new RegExp(envs.JUNIT_REPORTER_SUITE_NAME_FORMAT, 'ig'),
      } :
      {
        suiteNameFormat: /[^a-zA-Z0-9@]+/,
      }),
    ...(existy(parseBool(envs, 'JUNIT_REPORTER_ADD_FILE_ATTRIBUTE', false)) && {
      addFileAttribute: parseBool(envs, 'JUNIT_REPORTER_ADD_FILE_ATTRIBUTE', false)
    }),
    ...(envs.JUNIT_REPORTER_PACKAGE_NAME && {
      packageName: envs.JUNIT_REPORTER_PACKAGE_NAME,
    }),
  }
}

export const buildJunitSettings = ({
  outputFileFormat = (options) => {
    return `wdio-${ options.cid }-reporter.xml`
  },
  ...opts
}: JunitReporterOptions = {}): JunitReporterConfig => {
  return {
    reporters: [
      // In order to use the service you need to add `appium` to list of services
      ['junit', {
        // Define a directory where your xml files should get stored.
        ...(existy(opts.outputDir) && {
          outputDir: opts.outputDir,
        }),

        // Define the xml files created after the test execution.
        //
        // Note: `opts.capabilities` is your capabilities object for that
        // runner, so specifying `${opts.capabilities}` in your string
        // will return `[Object object]`. You must specify which properties
        // of capabilities you want in your filename.
        outputFileFormat,

        // Gives the ability to provide custom regex for formatting test suite
        // name (e.g. in output xml ).
        //
        // Reason for ignoring @ is; reporters like wdio-report-portal will
        // fetch the tags from testcase name given as @foo @bar
        ...(existy(opts.suiteNameFormat) && {
          suiteNameFormat: opts.suiteNameFormat,
        }),

        // Adds a file attribute to each testcase. This config is primarily for
        // CircleCI. This setting provides richer details but may break on other
        // CI platforms.
        ...(existy(opts.addFileAttribute) && {
          addFileAttribute: opts.addFileAttribute,
        }),

        // You can break out packages by an additional level by setting
        // `packageName`. For example, if you wanted to iterate over a test
        // suite with different environment variable set:
        //
        // `packageName: process.env.USER_ROLE` // => 'chrome.41 - administrator'
        ...(existy(opts.packageName) && {
          packageName: opts.packageName,
        }),

        // Allows to set various combinations of error notifications inside xml.
        // You can choose which key will be used where.
        // Default: `errorOptions: { error: 'message' }`
        errorOptions: {
          error: 'message',
          failure: 'message',
          stacktrace: 'stack',
        }
      }]
    ],
  }
}

export const setupJunitConfig = ({
  envs,
  ...opts
}: { envs: EnvRecord } & JunitReporterOptions): JunitReporterConfig => {
  const values = parseJunitSettings(envs)
  return buildJunitSettings({
    ...values,
    ...opts,
  })
}
