import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

dotenv.config()

const app = express()

// =======================
// CLERK WEBHOOK (🔥 MUST BE FIRST 🔥)
// =======================
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    await connectDB()            // DB connect (cached)
    return clerkWebhooks(req, res)
  }
)

// =======================
// NORMAL MIDDLEWARES
// =======================
app.use(cors())
app.use(express.json())

// =======================
// NORMAL ROUTES
// =======================
app.get('/', (req, res) => {
  res.send('api working')
})

// =======================
// EXPORT (NO listen() ❌)
// =======================
export default app
