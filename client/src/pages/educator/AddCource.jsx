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

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

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

  const removeChapter = chapterId => {
    setChapters(prev => prev.filter(ch => ch.id !== chapterId))
  }

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

  const handleSubmit = e => {
    e.preventDefault()

    const payload = {
      courseTitle,
      description: quillRef.current.root.innerHTML,
      coursePrice,
      discount,
      image,
      chapters
    }

    console.log('FINAL COURSE DATA:', payload)
  }

  return (
    <div className="h-screen overflow-scroll p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full text-gray-600"
      >
        <input
          placeholder="Course Title"
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <div>
          <p>Course Description</p>
          <div ref={editorRef} className="border rounded min-h-[120px]" />
        </div>

        <input
          type="number"
          placeholder="Price"
          value={coursePrice}
          onChange={e => setCoursePrice(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />

        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={e => setDiscount(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />

        <div
          onClick={handleChapter}
          className="bg-blue-100 p-2 rounded cursor-pointer text-center"
        >
          + Add Chapter
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="border rounded">
            <div className="flex justify-between items-center p-3">
              <span
                className="font-semibold cursor-pointer"
                onClick={() =>
                  setChapters(prev =>
                    prev.map(ch =>
                      ch.id === chapter.id
                        ? { ...ch, collapsed: !ch.collapsed }
                        : ch
                    )
                  )
                }
              >
                {chapterIndex + 1}. {chapter.chapterTitle}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>

                <img
                  src={assets.cross_icon}
                  alt=""
                  className="w-4 cursor-pointer"
                  onClick={() => removeChapter(chapter.id)}
                />
              </div>
            </div>

            {!chapter.collapsed && (
              <div className="p-3">
                {chapter.chapterContent.map((lec, i) => (
                  <div key={lec.id} className="text-sm mb-1">
                    {i + 1}. {lec.lectureTitle} ({lec.lectureDuration} mins)
                  </div>
                ))}

                <div
                  onClick={() => {
                    setCurrentChapterId(chapter.id)
                    setShowPopup(true)
                  }}
                  className="inline-block bg-gray-100 p-2 rounded cursor-pointer mt-2"
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-black text-white py-2.5 rounded mt-4"
        >
          ADD
        </button>

        {/* POPUP */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded w-80 relative shadow-2xl">
              <h2 className="font-semibold mb-3">Add Lecture</h2>

              <input
                placeholder="Lecture Title"
                value={lectureDetails.lectureTitle}
                onChange={e =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureTitle: e.target.value
                  })
                }
                className="border p-2 w-full mb-2"
              />

              <input
                type="number"
                placeholder="Duration"
                value={lectureDetails.lectureDuration}
                onChange={e =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureDuration: e.target.value
                  })
                }
                className="border p-2 w-full mb-2"
              />

              <input
                type="text"
                placeholder="Video URL"
                value={lectureDetails.lectureUrl}
                onChange={e =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureUrl: e.target.value
                  })
                }
                className="border p-2 w-full mb-2"
              />

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={e =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked
                    })
                  }
                />
                Free Preview
              </label>

              <button
                type="button"
                onClick={addLecture}
                className="bg-blue-500 text-white w-full p-2 rounded mt-2"
              >
                Add
              </button>

              <img
                src={assets.cross_icon}
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 w-4 cursor-pointer"
                alt=""
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default AddCource
