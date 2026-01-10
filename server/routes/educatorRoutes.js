import express from 'express'
import { addCourse, updateRoleToEducator } from '../controllers/educatorController.js'
import { protectedEducator } from '../middlewares/authMiddleware.js'
import upload from '../configs/multer.js'

const educatorRouter = express.Router()

// add educator role
educatorRouter.post('/update-role', updateRoleToEducator)

educatorRouter.post(
  '/add-course',
  upload.single('image'),
  protectedEducator,
  addCourse
)


export default educatorRouter


