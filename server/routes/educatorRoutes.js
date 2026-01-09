import express from 'express'
import { requireAuth } from '@clerk/express'
import { addCourse, updateRoleToEducator } from '../controllers/educatorController.js'
import { protectedEducator } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

// add educator role
educatorRouter.post('/update-role',requireAuth(),updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'),protectedEducator,addCourse)

export default educatorRouter