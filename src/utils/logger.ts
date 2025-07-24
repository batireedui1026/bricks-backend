type LogLevel = "info" | "warn" | "error" | "debug";

const log = (level: LogLevel, message: string, data?: any): void => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data) {
    console[level === "error" ? "error" : "log"](`${prefix} ${message}`, data);
  } else {
    console[level === "error" ? "error" : "log"](`${prefix} ${message}`);
  }
};

export default log;
