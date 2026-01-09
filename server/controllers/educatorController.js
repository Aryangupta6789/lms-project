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
    const parsedCourseData = await JSON.parse(courseData)
    parsedCourseData.educator = educatorId
    const newCourse = await course.create(parsedCourseData)
    const imageUpload = await cloudinary.uploader.upload(imagefile.path)
    newCourse.courseThumbnail = imageUpload.secure_url
    await newCourse.save()

    res.json({ success: true, message: 'course addded' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
