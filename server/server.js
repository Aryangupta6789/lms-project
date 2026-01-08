import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// middlewares
app.use(cors())

// connect to database
await connectDB()


// routes
app.get('/',(req,res)=>{
    res.send("api working")
})

app.post('/clerk',express.raw({ type: 'application/json' }),clerkWebhooks)



// PORT
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} `)
})