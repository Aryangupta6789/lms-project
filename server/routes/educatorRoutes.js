import express from 'express'
import { ClerkExpressRequireAuth } from '@clerk/express'
import { updateRoleToEducator } from '../controllers/educatorController'

const educatorRouter = express.Router()

// add educator role
educatorRouter.post('/update-role',ClerkExpressRequireAuth(),updateRoleToEducator)

export default educatorRouter