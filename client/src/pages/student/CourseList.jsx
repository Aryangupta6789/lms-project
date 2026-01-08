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
  }, [allCourses, data])
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
            {filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CourseList
