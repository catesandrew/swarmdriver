import wdioLogger from '@wdio/logger'
import prefix from 'loglevel-plugin-prefix'
import chalk from 'chalk'

// import {
//   isElement,
// } from './utils'

// error
// warn
// info
// debug
// trace

// The ERROR level denotes a serious problem that has to be dealt with. Not as
// serious as FATAL, which you'll see next, but still a problem. Think about an
// app failing to connect to the internet to synchronize some data. Sure, that's
// not good and it's definitely not the desired behavior, but it's not the end of the
// world. It still needs to be recorded, though, so someone can take care of the
// issue.

// The WARN level designates potentially harmful occurrences. What 'potentially
// harmful' means will, of course, vary in each situation. Those are situations
// that don't cause harm per se, but they could indicate that something is not
// quite right. It's a sign of a possible problem that deserves investigation.
// The same is true when talking about logs marked with the WARN logging level.

// The INFO level. You use the this logging level to record messages about
// routine application operation. Those are entries you usually don't care that
// much about, to be honest. If things go bad during development, you'll be
// looking at DEBUG entries. When things go bad in production, ERROR entries are
// what you're looking for. When things go red alert in production, you'll spend
// time looking at entries with the FATAL logging level. So INFO log entries
// inhabit this kind of grey area between the more sought-after levels. But
// they're far from being useless. Since they represent the mundane, everyday
// usage of the application, those entries might offer a valuable window through
// which you can better understand user behavior and gather usage statistics.

// The DEBUG level is not a lot of mystery. It includes information in a very
// granular way so developers-and other IT professionals-can then use that
// information to perform diagnostics on the application.

// The TRACE level. Think of this like DEBUG, but on steroids. This level logs
// information in a very fine-grained way. You probably wouldn't want to use it
// in production scenarios, under penalty of high consumption of resources.

/** The five levels `@wdio/logger` exposes, in decreasing severity. */
type LogMethodName = 'error' | 'warn' | 'info' | 'debug' | 'trace'

/** What `wdioLogger()` hands back: a loglevel logger with a name. */
type WdioLogger = ReturnType<typeof wdioLogger>

/** loglevel's `methodFactory` hook — builds the function behind `log.info` etc. */
type MethodFactory = (
  methodName: string,
  logLevel: number,
  loggerName: string | symbol,
) => (...args: any[]) => void

const loggers: Record<string, WdioLogger> = {}
const originals: Record<string, MethodFactory> = {}

const COLORS: Record<LogMethodName, string> = {
  error: 'red',
  warn: 'yellow',
  info: 'cyanBright',
  debug: 'green',
  trace: 'magenta'
}

const DEFAULT_LEVEL = 'warn'

const loggerMethodFactory: MethodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originals[loggerName as string](methodName, logLevel, loggerName)
  return (...args) => {
    rawMethod(...args)
  }
}

export interface BuildLoggerOptions {
  /** one of `trace | debug | info | warn | error | silent` */
  level?: string
  /** logger name; also the `[%n]` prefix and the cache key */
  name?: string
}

// let logger
export const buildLogger = ({
  level = DEFAULT_LEVEL,
  name = 'wdio',
}: BuildLoggerOptions = {}): WdioLogger => {
  // check if logger was already initiated
  if (loggers[name]) {
    return loggers[name]
  }

  const logLevel = process.env.SWARMDRIVER_LOG_LEVEL || level

  // `@wdio/logger`'s own typings model the second argument as absent; it is
  // forwarded straight to `loglevel.getLogger(name).setLevel(level)`.
  const newLogger = loggers[name] = (wdioLogger as any)(name, logLevel) as WdioLogger
  originals[name] = newLogger.methodFactory as MethodFactory
  newLogger.methodFactory = loggerMethodFactory as typeof newLogger.methodFactory
  newLogger.setLevel(logLevel as Parameters<WdioLogger['setLevel']>[0])

  prefix.apply(loggers[name], {
    template: '[%n] %l:',
    levelFormatter: (level: string) => (chalk as any)[COLORS[level as LogMethodName]](level.toUpperCase()),
    nameFormatter: (name: string) => chalk.whiteBright(name),
  })

  return newLogger
}

export default buildLogger
