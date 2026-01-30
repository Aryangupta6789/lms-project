import express, { application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoute.js'

dotenv.config()

const app = express()

/* =======================
/* =======================
   DATABASE & CLOUDINARY
======================= */
// Initialize connection but don't crash the module if they fail immediately
const initializeServices = async () => {
  try {
    await connectDB()
    await connectCloudinary()
    console.log('Services connected')
  } catch (error) {
    console.error('Failed to connect to services on startup:', error)
  }
}
// Do NOT await top-level if you want the app to export successfully despite errors
// However, for Vercel serverless, we usually WANT to wait. 
// But if env vars are missing, we fail. 
// Let's await it but catch the error.
try {
  await initializeServices()
} catch (e) {
  console.error('Top level init error', e)
}

/* =======================
   CORS (LOCALHOST ONLY)
======================= */
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5017', 'https://lms-project-five-theta.vercel.app', 'https://lms-project-uyxg.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)

// Stripe webhook FIRST (raw body)
app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
)

// Clerk webhook
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

app.use('/educator', educatorRouter)

app.use('/course', courseRouter)

app.use('/user', userRouter)


/* =======================
   EXPORT (NO LISTEN)
======================= */
export default app
