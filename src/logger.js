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

const loggers = {}
const originals = {}

const COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'cyanBright',
  debug: 'green',
  trace: 'magenta'
}

const DEFAULT_LEVEL = 'warn'

const loggerMethodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originals[loggerName](methodName, logLevel, loggerName)
  return (...args) => {
    rawMethod(...args)
  }
}

// let logger
export const buildLogger = ({
  level = DEFAULT_LEVEL,
  name = 'wdio',
} = {}) => {
  // check if logger was already initiated
  if (loggers[name]) {
    return loggers[name]
  }

  const logLevel = process.env.SWARMDRIVER_LOG_LEVEL || level

  const newLogger = loggers[name] = wdioLogger(name, logLevel)
  originals[name] = newLogger.methodFactory
  newLogger.methodFactory = loggerMethodFactory
  newLogger.setLevel(logLevel)

  prefix.apply(loggers[name], {
    template: '[%n] %l:',
    levelFormatter: (level) => chalk[COLORS[level]](level.toUpperCase()),
    nameFormatter: (name) => chalk.whiteBright(name),
  })

  return newLogger
}

export default buildLogger
