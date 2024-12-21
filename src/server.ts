import * as dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { dbConnection } from './config/database'
import { logger } from './utils/logger'

const PORT = process.env.PORT || 3000

function startApp() {
  dbConnection()
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`)
      })
    })
    .catch((err) => {
      logger.error(err.message)
    })
}

startApp()
