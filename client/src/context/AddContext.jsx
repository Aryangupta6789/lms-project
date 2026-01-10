import { createContext, useEffect, useState } from 'react'
import { dummyCourses } from '../assets/assets'
import humanizeDuration from 'humanize-duration'
import { useUser } from '@clerk/clerk-react'


export const AppContext = createContext()
export const AppContextProvider = props => {
  const currency = import.meta.env.VITE_CURRENCY
  const [allCourses, setAllCourses] = useState(dummyCourses)
  const [isEducator, setIsEducator] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const { user, isLoaded } = useUser()
  
  useEffect(() => {
  if (isLoaded && user) {
    setIsEducator(user.publicMetadata?.role === 'educator')
  } else {
    setIsEducator(false)
  }
}, [isLoaded, user])

  const calculateRating = course => {
    const ratings = course.courseRatings || []

    if (ratings.length === 0) return 0

    let totalRating = 0
    ratings.forEach(r => {
      totalRating += r.rating
    })

    return totalRating / ratings.length
  }

  const calculateChapterTime = chapter => {
    let time = 0
    chapter.chapterContent.forEach(lecture => {
      time += lecture.lectureDuration
    })
    return humanizeDuration(time * 60 * 1000, {
      units: ['h', 'm']
    })
  }

  const calculateCourseDuration = course => {
    let time = 0
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        time += lecture.lectureDuration
      })
    })
    return humanizeDuration(time * 60 * 1000, {
      units: ['h', 'm']
    })
  }

  const calculateNoOfLectures = course => {
    let totalLectures = 0
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    })
    return totalLectures
  }

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses)
  }

  useEffect(()=>{
    fetchUserEnrolledCourses(dummyCourses)
  },[])

  const value = {
    currency,
    allCourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses
  }
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}
