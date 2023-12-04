// setup winston
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.align(),
		format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
	),
	transports: [new transports.Console()]
});

export default logger;
