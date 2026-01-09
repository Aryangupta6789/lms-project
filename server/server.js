import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'

dotenv.config()

const app = express()

// =======================
// CLERK WEBHOOK (🔥 MUST BE FIRST 🔥)
// =======================
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    return clerkWebhooks(req, res)
  }
)

// =======================
// NORMAL MIDDLEWARES
// =======================
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
// =======================
// NORMAL ROUTES
// =======================
app.get('/', (req, res) => {
  res.send('api working')
})
app.use('/api/educator',educatorRouter)

// =======================
// EXPORT (NO listen() ❌)
// =======================
export default app
