import React from 'react'
import Navbar from '../../components/student/Navbar'
import Hero from '../../components/student/hero'
import Searchbar from '../../components/student/Searchbar'
import Companies from '../../components/student/Companies'
import CourceSection from '../../components/student/CourseSection'
import CourseCard from '../../components/student/CourseCard'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
     <Hero />
     <Companies />
     <CourceSection />
     <TestimonialsSection />
     <CallToAction />
     <Footer />
    

     
    </div>
  )
}

export default Home
