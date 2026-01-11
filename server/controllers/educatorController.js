import { clerkClient, getAuth } from '@clerk/express'
import course from '../models/course.js'
import { v2 as cloudinary } from 'cloudinary'

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

    res.json({
      success: true,
      message: 'You can publish a course now'
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// ================= ADD COURSE =================
export const addCourse = async (req, res) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    // 🔥 SAFETY CHECKS
    if (!req.body.courseData) {
      return res.status(400).json({
        success: false,
        message: 'courseData missing'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail not attached'
      })
    }

    // ✅ SAFE PARSE
    let parsedCourseData
    try {
      parsedCourseData = JSON.parse(req.body.courseData)
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid courseData JSON'
      })
    }

    parsedCourseData.educator = userId

    // ✅ CLOUDINARY UPLOAD
    const imageUpload = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'courses'
      }
    )

    parsedCourseData.courseThumbnail = imageUpload.secure_url

    // ✅ DB SAVE
    const newCourse = await course.create(parsedCourseData)

    res.json({
      success: true,
      message: 'Course added successfully',
      course: newCourse
    })
  } catch (err) {
    console.error('ADD COURSE ERROR:', err)

    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    })
  }
}
export const getEducatorCourses = async(req,res)=>{
  try{
const { userId } = getAuth(req)
const educator = userId
const courses = await course.find({educator})
res.json({success:true,courses})
  }catch(err){
    res.json({success:false,message:err.message})
  }
}

