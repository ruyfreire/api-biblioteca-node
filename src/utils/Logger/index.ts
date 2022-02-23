import winston, { Logform } from 'winston'

const customFormat = (...formats: Logform.Format[]) =>
  winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(
      ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
    ),
    ...formats
  )

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: customFormat(
        winston.format.colorize({
          all: true
        })
      )
    }),
    new winston.transports.File({
      format: customFormat(),
      filename: 'logs.log',
      maxsize: 5242880
    })
  ]
})

export { logger }
