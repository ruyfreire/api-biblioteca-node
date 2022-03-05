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

          let idError = ''
          if (level === 'error' && meta?.error?.id_error) {
            idError = `| id_error: ${meta.error.id_error}`
          }

          return `${timestamp} [${level}]: ${message} ${restMessage} ${idError}`.trim()
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
          let originalMessage = meta?.originalError || ''
          let errorMessage = meta?.error || ''

          if (originalMessage instanceof Error) {
            console.log('originalMessage logger')
            originalMessage = originalMessage.message
          }

          if (errorMessage instanceof Error) {
            errorMessage = errorMessage.message
          }

          const restMessage = JSON.stringify({
            ...meta,
            error: errorMessage,
            originalError: originalMessage || errorMessage
          })

          return `${timestamp} [${level}]: ${message} ${restMessage}`.trim()
        })
      ),
      filename: 'logs.log',
      maxsize: 5242880
    })
  ]
})

export { logger }
