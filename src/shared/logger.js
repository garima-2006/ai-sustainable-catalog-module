const formatMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  });
};

export const logger = {
  info: (message, meta = {}) => {
    console.log(formatMessage("INFO", message, meta));
  },

  error: (message, meta = {}) => {
    console.error(formatMessage("ERROR", message, meta));
  },

  warn: (message, meta = {}) => {
    console.warn(formatMessage("WARN", message, meta));
  },

  ai: (message, meta = {}) => {
    console.log(formatMessage("AI", message, meta));
  }
};