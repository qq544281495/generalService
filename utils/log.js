const log4js = require("log4js");

const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};

log4js.configure({
  appenders: {
    console: { type: "console" },
    warn: {
      type: "dateFile",
      filename: "logs/warn",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
    error: {
      type: "dateFile",
      filename: "logs/error",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
    fatal: {
      type: "dateFile",
      filename: "logs/fatal",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["console"], level: "debug" },
    warn: { appenders: ["warn", "console"], level: "warn" },
    error: { appenders: ["error", "console"], level: "error" },
    fatal: { appenders: ["fatal", "console"], level: "fatal" },
  },
});

exports.trace = (content) => {
  let logger = log4js.getLogger();
  logger.level = levels.trace;
  logger.trace(content);
};

exports.debug = (content) => {
  let logger = log4js.getLogger();
  logger.level = levels.debug;
  logger.debug(content);
};

exports.info = (content) => {
  let logger = log4js.getLogger();
  logger.level = levels.info;
  logger.info(content);
};

exports.warn = (content) => {
  let logger = log4js.getLogger("warn");
  logger.level = levels.warn;
  logger.warn(content);
};

exports.error = (content) => {
  let logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(content);
};

exports.fatal = (content) => {
  let logger = log4js.getLogger("fatal");
  logger.level = levels.fatal;
  logger.fatal(content);
};
