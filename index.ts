import { Server } from './src/server'
import { logger } from './src/utils/Logger'

const port = process.env.PORT || 3001
const server = new Server(port)

server
  .start()
  .then(() => {
    logger.debug('----------------------------------------')
    logger.debug(`\tServidor rodando na porta ${port}`)
    logger.debug('----------------------------------------')
  })
  .catch((error) => {
    logger.error('Start server error:', { error })
  })
