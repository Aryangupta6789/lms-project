import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useMatch } from 'react-router-dom'
import { useClerk, UserButton, useSignIn, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AddContext'

const Navbar = () => {
  const navigate = useNavigate()
  const isCourceListpage = useMatch('/cource-list/*')

  const { isEducator } = useContext(AppContext)
  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
  try {
    const res = await fetch(
      'https://lms-backend-self-theta.vercel.app/api/educator/update-role',
      {
        method: 'POST',
        credentials: 'include'
      }
    )

    const raw = await res.text()
    console.log('RAW RESPONSE 👉', raw)
    console.log('STATUS 👉', res.status)

    // sirf debug ke liye
    alert(raw)
  } catch (err) {
    console.error('FETCH ERROR 👉', err)
    alert(err.message)
  }
}


  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourceListpage ? 'bg-white' : 'bg-cyan-100/70'
      }`}
    >
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='logo'
        className='w-28 lg:w-32 cursor-pointer'
      />
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {user && (
            <>
              <button
                onClick={() => {
                  if (isEducator) {
                    navigate('/educator')
                  } else {
                    becomeEducator()
                  }
                }}
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className='bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer'
          >
            Create account
          </button>
        )}
      </div>

      {/* for phone screen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {user && (
            <>
              <button onClick={() => navigate('/educator')}>
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button className='cursor-pointer' onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt='user-icon'></img>
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
