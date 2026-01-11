import express from 'express'
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
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

educatorRouter.get('/dashboard', protectedEducator, educatorDashboardData)

educatorRouter.get(
  '/enrolled-students',
  protectedEducator,
  getEnrolledStudentsData
)

export default educatorRouter
