import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'

dotenv.config()

const app = express()

/* =======================
   DATABASE & CLOUDINARY
======================= */
await connectDB()
await connectCloudinary()

/* =======================
   CORS (LOCALHOST ONLY)
======================= */
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

/* =======================
   CLERK WEBHOOK (RAW)
======================= */
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
)

/* =======================
   NORMAL MIDDLEWARES
======================= */
app.use(express.json())
app.use(clerkMiddleware())

/* =======================
   ROUTES
======================= */
app.get('/', (req, res) => {
  res.send('API working 🚀')
})

app.use('/api/educator', educatorRouter)

/* =======================
   EXPORT (NO LISTEN)
======================= */
export default app
