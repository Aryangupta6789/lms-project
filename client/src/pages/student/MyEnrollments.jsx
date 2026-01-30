// pages/student/MyEnrollments.jsx
import { AppContext } from '../../context/AddContext'
import { useContext,useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {
  const navigate = useNavigate()
  const { enrolledCourses, calculateCourseDuration, fetchUserCourseProgress, calculateNoOfLectures } =
    useContext(AppContext)

  const [progressArray, setProgressArray] = useState([])

  useEffect(() => {
    if (enrolledCourses) {
      const fetchProgress = async () => {
        const tempProgressArray = await Promise.all(
          enrolledCourses.map(async course => {
            const progress = await fetchUserCourseProgress(course._id)
            const totalLectures = calculateNoOfLectures(course)
            const completedLectures = progress ? progress.lectureCompleted.length : 0
            const percent = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0
            return { courseId: course._id, percent }
          })
        )
        setProgressArray(tempProgressArray)
      }
      fetchProgress()
    }
  }, [enrolledCourses])

  return (
    // 🔥 FULL HEIGHT PAGE
    <div className="min-h-screen flex flex-col">
      
      {/* 🔥 MAIN CONTENT */}
      <div className="flex-grow md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="w-full border mt-10">
          <thead className="border-b text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course, index) => {
                const progress = progressArray.find(p => p.courseId === course._id)
                const percent = progress ? progress.percent : 0

                return (
                <tr key={course._id} className="border-b">
                  <td className="px-4 py-3 flex gap-3">
                    <img
                      src={course.courseThumbnail}
                      className="w-28"
                    />
                    <div className='flex-1'>
                      <p>{course.courseTitle}</p>
                      <Line
                        percent={percent}
                        strokeWidth={4}
                        strokeColor="#2563eb"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        navigate('/player/' + course._id)
                      }
                      className="bg-blue-600 text-white px-4 py-2"
                    >
                      Continue
                    </button>
                  </td>
                </tr>
              )})
            ) : (
              // 🔥 CENTERED EMPTY STATE
              <tr>
                <td colSpan="3">
                  <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                    <p className="text-lg font-medium">
                      No Enrollments Found
                    </p>
                    <p className="text-sm mt-2">
                      Purchase a course to start learning 🚀
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 FOOTER ALWAYS AT BOTTOM */}
      <Footer />
    </div>
  )
}

export default MyEnrollments
