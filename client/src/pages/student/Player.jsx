import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AddContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext)
  const { courseId } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)

  const toggleSection = index => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const getCourseData = () => {
    const course = enrolledCourses.find(c => c._id === courseId)
    setCourseData(course || null)
  }

  useEffect(() => {
    if (!courseId) return
    if (!enrolledCourses || enrolledCourses.length === 0) return

    const course = enrolledCourses.find(c => c._id === courseId)
    setCourseData(course || null)
  }, [courseId, enrolledCourses])

  if (!courseData) return <p className='p-10'>Loading course...</p>

  return (
    <>
    <div className='p-4 sm:p-10 md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/* LEFT COLUMN */}
      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold mb-4'>Course Structure</h2>

        {courseData.courseContent.map((chapter, index) => (
          <div
            key={index}
            className='mb-3 rounded border border-gray-300 bg-white overflow-hidden'
          >
            {/* chapter header */}
            <div
              className='flex items-center justify-between px-4 py-3 cursor-pointer'
              onClick={() => toggleSection(index)}
            >
              <div className='flex items-center gap-2'>
                <img
                  src={assets.down_arrow_icon}
                  alt='arrow'
                  className={`w-4 h-4 transition-transform ${
                    openSections[index] ? 'rotate-180' : ''
                  }`}
                />
                <p className='font-medium'>{chapter.chapterTitle}</p>
              </div>

              <p className='text-xs text-gray-600'>
                {chapter.chapterContent.length} lectures •{' '}
                {calculateChapterTime(chapter)}
              </p>
            </div>

            {/* lectures */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections[index] ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <ul className='pl-6 pr-4 py-2'>
                {chapter.chapterContent.map((lecture, i) => (
                  <li key={i} className='py-2'>
                    <div className='flex items-start gap-2'>
                      <img
                        src={assets.play_icon}
                        alt='play'
                        className='w-4 h-4 mt-1'
                      />

                      <div className='flex justify-between w-full text-sm'>
                        <p>{lecture.lectureTitle}</p>

                        <div className='flex gap-4'>
                          {lecture.lectureUrl && (
                            <button
                              className='text-green-600 font-medium'
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapterTitle: chapter.chapterTitle,
                                  chapterIndex: index + 1,
                                  lectureIndex: i + 1
                                })
                              }
                            >
                              Watch
                            </button>
                          )}

                          <span className='text-blue-500'>
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ['h', 'm'] }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-xl font-bold'>Rate this Course:</h1>
          <Rating initialRating={0}/>
        </div>
      </div>

      <div className='md:mt-10'>
        {playerData ? (
          <div>
            <YouTube
              videoId={playerData.lectureUrl.split('/').pop()}
              iframeClassName='w-full aspect-video'
            />
            <div className='flex justify-between items-center mt-1'>
              <p>
                {playerData.chapterIndex}.{playerData.lectureIndex}{' '}
                {playerData.lectureTitle}
              </p>

              <button className='text-blue-600'>{false ? 'completed' : 'mark as complete'}</button>
            </div>
          </div>
        ) : (
          <img src={courseData ? courseData.courseThumbnail : ''} alt='' />
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}

export default Player
