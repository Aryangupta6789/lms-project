import { createContext, useEffect, useState } from 'react'
import { dummyCourses } from '../assets/assets'
import humanizeDuration from 'humanize-duration'
import { useUser } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'

export const AppContext = createContext()
export const AppContextProvider = props => {
  const { getToken } = useAuth()
  const currency = import.meta.env.VITE_CURRENCY
  const [allCourses, setAllCourses] = useState([])
  const [isEducator, setIsEducator] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [enrolledStudents, setEnrolledStudents] = useState(null)

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
    try {
      const token = await getToken()

      const res = await fetch(
        'https://lms-backend-self-theta.vercel.app/user/enrolled-courses',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        'https://lms-backend-self-theta.vercel.app/educator/courses',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setAllCourses(data.courses)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchEnrolledStudentsData = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        'https://lms-backend-self-theta.vercel.app/educator/enrolled-students',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        'https://lms-backend-self-theta.vercel.app/educator/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setDashboardData(data.dashboardData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses()
    }
  }, [isEducator])

  useEffect(() => {
    fetchUserEnrolledCourses()
  }, [])

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
    fetchUserEnrolledCourses,
    fetchEducatorCourses,
    fetchDashboardData,
    dashboardData,
    fetchEnrolledStudentsData,
    enrolledStudents
  }
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}
