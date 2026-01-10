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

await connectDB()
await connectCloudinary()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks)

app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('API working 🚀')
})

app.use('/api/educator', educatorRouter)

export default app
