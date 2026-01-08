import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const serachHandler = e => {
    e.preventDefault()
    navigate('/course-list' + '/' + input)
  }

  return (
    <form
      onSubmit={serachHandler}
      className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'
    >
      <img
        src={assets.search_icon}
        alt='search-icon'
        className='md:auto w-10 px-3'
      ></img>
      <input
        type='text'
        placeholder='search for courses'
        className='w-full h-full outline-none text-gray-500/80'
        onChange={e => {
          setInput(e.target.value)
          console.log(input)
        }}
        value={input}
      />
      <button
        type='submit'
        className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1'
      >
        Search
      </button>
    </form>
  )
}

export default Searchbar
