import express from 'express'
import { requireAuth } from '@clerk/express'
import { updateRoleToEducator } from '../controllers/educatorController.js'

const educatorRouter = express.Router()

// add educator role
educatorRouter.post('/update-role',requireAuth(),updateRoleToEducator)

export default educatorRouter