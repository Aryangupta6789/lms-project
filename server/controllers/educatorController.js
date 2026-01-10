import { clerkClient, getAuth } from '@clerk/express'
import course from '../models/course.js'
import { v2 as cloudinary } from 'cloudinary'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    })
  }

  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator'
      }
    })

    return res.json({
      success: true,
      message: 'You can publish a course now'
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
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

    const imageUpload = await cloudinary.uploader.upload(`data:${imagefile.mimetype};base64,${imagefile.buffer.toString('base64')}`)
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
