import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    LectureOrder: { type: Number, required: true },
},{_id:false})

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  chapterContent:[lectureSchema]
},{_id:false})

const courseSchema = new mongoose.Schema(
  {
    CourseTitle: {
      type: String,
      required: true
    },
    CourseDescription: {
      type: String,
      required: true
    },
    CourseThumbnail: {
      type: String,
      required: true
    },
    CoursePrice: {
      type: Number,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    courseContent: [chapterSchema],
    CourseRatings: [
      { userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }
    ],
    educator: {
      type: String,
      ref: 'user',
      required: true
    },
    enrolledStudents: [{
      type: String,
      ref: 'user'
    }
    ]
  },
  { timestamps: true, minimize: false }
)

const course = mongoose.model('course',courseSchema)
export default course