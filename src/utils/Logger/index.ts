import winston, { Logform } from 'winston'

const customFormat = (...formats: Logform.Format[]) =>
  winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    ...formats
  )

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: customFormat(
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const data = JSON.stringify(meta)
          const errorMessage = meta?.error?.message || ''
          const restMessage = data.length > 2 ? errorMessage : ''
          return `${timestamp} [${level}]: ${message} ${restMessage}`.trim()
        }),
        winston.format.colorize({
          all: true
        })
      )
    }),
    new winston.transports.File({
      level: 'error',
      silent: process.env.NODE_ENV === 'test',
      format: customFormat(
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const data = JSON.stringify(meta)
          const restMessage = data.length > 2 ? data : ''
          return `${timestamp} [${level}]: ${message} ${restMessage}`.trim()
        })
      ),
      filename: 'logs.log',
      maxsize: 5242880
    })
  ]
})

export { logger }
