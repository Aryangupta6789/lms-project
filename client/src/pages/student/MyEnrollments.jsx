import { AppContext } from '../../context/AddContext'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {
  const navigate = useNavigate()
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)

  // dummy progress data
  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ])

  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>

      <table className='md:table-auto table-fixed w-full border mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
          <tr>
            <th className='px-4 py-3 font-semibold'>Course</th>
            <th className='px-4 py-3 font-semibold'>Duration</th>
            <th className='px-4 py-3 font-semibold'>Completed</th>
            <th className='px-4 py-3 font-semibold'>Status</th>
          </tr>
        </thead>

        <tbody className='text-gray-700'>
          {enrolledCourses.map((course, index) => {
            const progressData = progressArray[index]
            const progress =
              progressData && progressData.totalLectures > 0
                ? (progressData.lectureCompleted / progressData.totalLectures) *
                  100
                : 0

            const isCompleted =
              progressData &&
              progressData.lectureCompleted === progressData.totalLectures

            return (
              <tr key={index} className='border-b border-gray-500/20'>
                {/* Course */}
                <td className='md:px-4 pl-2 py-3 flex items-center gap-3'>
                  <img
                    src={course.courseThumbnail}
                    alt=''
                    className='w-14 sm:w-24 md:w-28'
                  />
                  <div className='w-full'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>

                    <div style={{ height: 6 }}>
                      <Line
                        percent={progress}
                        strokeWidth={4}
                        strokeColor='#2563eb'
                        trailColor='#e5e7eb'
                        strokeLinecap='butt'
                        style={{ height: 6 }}
                      />
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>

                {/* Completed */}
                <td className='px-4 py-3 max-sm:hidden'>
                  {progressData &&
                    `${progressData.lectureCompleted}/${progressData.totalLectures}`}{' '}
                  Lectures
                </td>

                {/* Status */}
                <td className='px-4 py-3 max-sm:text-right'>
                  <button
                    onClick={() => navigate('/player/' + course._id)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 text-white text-xs sm:text-sm ${
                      isCompleted ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'On Going'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
      <Footer />
    </>
  )
}

export default MyEnrollments
