import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AddContext'
import Loading from '../../components/student/Loading'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const MyCourses = () => {
  const { currency, educatorCourses } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    if (educatorCourses) {
      setCourses(educatorCourses)
    }
  }, [educatorCourses])

  const { getToken } = useAuth()
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleDelete = async (id) => {
    if(confirm('Are you sure you want to delete this course?')){
      try {
        const token = await getToken()
        const res = await fetch(`${backendUrl}/educator/delete-course/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setCourses(prev => prev.filter(course => course._id !== id))
          alert(data.message)
        } else {
          alert(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return courses ? (
    <div className="h-screen flex flex-col md:p-8 p-4 pt-8">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>

        <div className="w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-auto w-full">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">All Courses</th>
                <th className="px-4 py-3 font-semibold">Earnings</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Published On</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {courses.map(course => (
                <tr
                  key={course._id}
                  className="border-b border-gray-500/20"
                >
                  {/* Course */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="w-16 rounded"
                    />
                    <span className="hidden md:block truncate">
                      {course.courseTitle}
                    </span>
                  </td>

                  {/* Earnings */}
                  <td className="px-4 py-3">
                    {currency}{' '}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.coursePrice * course.discount) / 100)
                    )}
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  {/* Published Date */}
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => navigate('/educator/add-course', { state: { courseToEdit: course } })}
                      className="px-2.5 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MyCourses
