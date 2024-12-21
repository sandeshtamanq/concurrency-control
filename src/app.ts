import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { requestLogger } from './middlewares/requestLogger'
import authRouter from './routes/auth.routes'
import bookingRouter from './routes/booking.routes'
import { eventRouter } from './routes/event.routes'

const app = express()

app.use(
  cors({
    origin: 'localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  }),
)

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger)
}
app.use(cookieParser())

// Middleware to parse JSON
app.use(
  express.json({
    limit: '10mb',
  }),
)

//routes
app.use('/api/v1', authRouter)
app.use('/api/v1/booking', bookingRouter)
app.use('/api/v1/event', eventRouter)

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'not found',
  })
})

export default app
