import React, { useRef, useState, useEffect } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { assets } from '../../assets/assets'

function AddCource () {
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)

  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  })

  /* ================= Quill Init ================= */
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

  /* ================= Chapter ================= */
  const handleChapter = () => {
    setChapters(prev => [
      ...prev,
      {
        id: uniqid(),
        chapterTitle: `Chapter ${prev.length + 1}`,
        chapterContent: [],
        collapsed: false
      }
    ])
  }

  const removeChapter = id => {
    setChapters(prev => prev.filter(ch => ch.id !== id))
  }

  /* ================= Lecture ================= */
  const addLecture = () => {
    setChapters(prev =>
      prev.map(ch =>
        ch.id === currentChapterId
          ? {
              ...ch,
              chapterContent: [
                ...ch.chapterContent,
                { ...lectureDetails, id: uniqid() }
              ]
            }
          : ch
      )
    )

    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    })

    setShowPopup(false)
  }

  /* ================= Submit ================= */
  const handleSubmit = async e => {
    e.preventDefault()

    if (!image) {
      alert('Please upload a course thumbnail')
      return
    }

    // ✅ FIXED (extra bracket removed)
    const formattedChapters = chapters.map((ch, chIndex) => ({
      chapterId: ch.id,
      chapterOrder: chIndex + 1,
      chapterTitle: ch.chapterTitle,
      chapterContent: ch.chapterContent.map((lec, lecIndex) => ({
        lectureId: lec.id,
        lectureTitle: lec.lectureTitle,
        lectureDuration: Number(lec.lectureDuration),
        lectureUrl: lec.lectureUrl,
        isPreviewFree: lec.isPreviewFree,
        lectureOrder: lecIndex + 1
      }))
    }))

    const formData = new FormData()

    formData.append(
      'courseData',
      JSON.stringify({
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice,
        discount,
        courseContent: formattedChapters
      })
    )

    formData.append('image', image)

    try {
      const res = await fetch(
        'https://YOUR-VERCEL-BACKEND.vercel.app/api/educator/add-course',
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      )

      const data = await res.json()
      console.log('SUCCESS:', data)
      alert('Course added successfully 🎉')
    } catch (err) {
      console.error('ERROR:', err)
      alert('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Add New Course</h2>

        <div>
          <label className="font-medium">Course Title</label>
          <input
            value={courseTitle}
            onChange={e => setCourseTitle(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="font-medium">Course Description</label>
          <div
            ref={editorRef}
            className="border rounded h-32 overflow-y-auto"
          />
        </div>

        <div className="flex gap-6">
          <div>
            <label className="font-medium">Price (₹)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={e => setCoursePrice(Number(e.target.value))}
              className="border p-2 rounded w-40"
            />
          </div>

          <div>
            <label className="font-medium">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="border p-2 rounded w-32"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
        </div>

        <div
          onClick={handleChapter}
          className="bg-blue-50 hover:bg-blue-100 p-2 rounded cursor-pointer text-center font-medium"
        >
          + Add Chapter
        </div>

        <button className="bg-black text-white py-2.5 rounded w-full">
          Add Course
        </button>
      </form>
    </div>
  )
}

export default AddCource
