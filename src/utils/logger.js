import fs from 'fs';
import path from 'path';

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logToFile = (level, message) => {
  const logFile = path.join(logsDir, `${level}.log`);
  const logMessage = `${getTimestamp()} [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
};

export const logger = {
  info: (message) => {
    console.log(`[${getTimestamp()}] INFO: ${message}`);
    logToFile('info', message);
  },
  error: (message, error) => {
    const fullMessage = error ? `${message} - ${error.message}` : message;
    console.error(`[${getTimestamp()}] ERROR: ${fullMessage}`);
    logToFile('error', fullMessage);
  },
  warn: (message) => {
    console.warn(`[${getTimestamp()}] WARN: ${message}`);
    logToFile('warn', message);
  }
};
