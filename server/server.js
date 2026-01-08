import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

dotenv.config()

const app = express()

// ===== NORMAL MIDDLEWARES =====
app.use(cors())
app.use(express.json()) // normal APIs ke liye

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.send('api working')
})

// ===== CLERK WEBHOOK (SPECIAL) =====
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    await connectDB()        // DB connect per request (safe)
    return clerkWebhooks(req, res)
  }
)


export default app
