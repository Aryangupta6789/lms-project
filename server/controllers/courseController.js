import course from '../models/course.js'


export const getAllCourse = async (req, res) => {
  try {
    const courses = await course
      .find({ isPublished: true })
      .select(['-courseContent', '-enrolledStudents'])
      .populate({ path: 'educator' })
    res.json({ success: true, courses })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// get course by id
export const getCourseById = async (req, res) => {
  const { id } = req.params
  try {
    const courseData = await course.findById(id).populate({ path: 'educator' })

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = ''
        }
      })
    })

    res.json({ success: true, courseData })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}


