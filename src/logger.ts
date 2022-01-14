import winston, { LoggerOptions, Logger } from 'winston'

export const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logs/debug.log', level: 'debug' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
}

export class GregorLogger {
    private static instance: Logger

    private constructor() {}

    static getInstance(options?: LoggerOptions): Logger {
        if (GregorLogger.instance == null) {
            const logger = winston.createLogger(options ?? DEFAULT_LOGGER_OPTIONS)

            if (process.env.NODE_ENV !== 'production') {
                logger.add(new winston.transports.Console({ format: winston.format.simple() }))
            }

            GregorLogger.instance = logger
        }

        return GregorLogger.instance
    }
}
