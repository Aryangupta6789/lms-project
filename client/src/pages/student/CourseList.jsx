import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Searchbar from '../../components/student/Searchbar'
import { AppContext } from '../../context/AddContext'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CourseList = () => {
  const navigate = useNavigate()
  const { data } = useParams()
  const { allCourses } = useContext(AppContext)
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    const tempCourses = allCourses
    if (data) {
      setFilteredCourse(
        tempCourses.filter(courses =>
          courses.courseTitle.toLowerCase().includes(data.toLowerCase())
        )
      )
    } else {
      setFilteredCourse(tempCourses)
    }
    setCurrentPage(1) // Reset to page 1 on filter change
  }, [allCourses, data])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredCourse.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentCourses = filteredCourse.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }
  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-4x1 font-semibold text-gray-800'>
              Course List
            </h1>
            <p className='text-gray-500'>
              <span
                className='text-blue-600 cursor-pointer'
                onClick={() => navigate('/')}
              >
                Home
              </span>{' '}
              /<span>Course List</span>
            </p>
          </div>
          <Searchbar data={data} />
        </div>
        {data && (
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-4 text-gray-600'>
            <p>{data}</p>
            <img
              src={assets.cross_icon}
              alt=''
              className='cursor-pointer'
              onClick={() => navigate('/course-list')}
            />
          </div>
        )}

        <div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
            {currentCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mb-16'>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CourseList
