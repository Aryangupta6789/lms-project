import { clerkClient } from '@clerk/express'
import course from '../models/course.js'
import { v2 as cloudinary } from 'cloudinary'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator'
      }
    })

    return res.json({
      success: true,
      message: 'You can publish a course now'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body
    const imagefile = req.file
    const educatorId = req.auth.userId

    if (!imagefile) {
      return res.json({ success: false, message: 'thumbnail not attached' })
    }

    const parsedCourseData = JSON.parse(courseData)
    parsedCourseData.educator = educatorId

    const imageUpload = await cloudinary.uploader.upload(imagefile.path)
    parsedCourseData.courseThumbnail = imageUpload.secure_url

    const newCourse = await course.create(parsedCourseData)

    res.json({
      success: true,
      message: 'Course added successfully',
      course: newCourse
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
