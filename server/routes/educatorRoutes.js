import express from 'express'
import {
  addCourse,
  getEducatorCourses,
  updateRoleToEducator
} from '../controllers/educatorController.js'
import { protectedEducator } from '../middlewares/authMiddleware.js'
import upload from '../configs/multer.js'

const educatorRouter = express.Router()

educatorRouter.post('/update-role', updateRoleToEducator)

educatorRouter.post(
  '/add-course',
  upload.single('image'),
  protectedEducator,
  addCourse
)

educatorRouter.get('/courses', protectedEducator, getEducatorCourses)

export default educatorRouter
