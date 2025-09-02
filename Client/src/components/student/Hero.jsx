import React from 'react'
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';
const Hero = () => {
  return (
    <div className=' flex flex-col justify-center items-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
        <h1 className='relative text-3xl md:text-home-heading-large text-home-heading-small font-bold text-gray-800 max-w-3xl mx-auto'>Empower Your Future With Our Online Courses designed to <span className='text-blue-600'> Transform Your Career</span> <img src = {assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0'/> </h1>
        <p className='md:block hidden max-w-2xl mx-auto text-gray-500'> we bring you the best online courses to help you achieve your goals and unlock your potential for success.</p>
        <p className='md:hidden max-w-2xl mx-auto text-gray-500'> we bring you the best online courses to help you achieve your goals.</p>
        < SearchBar />
    </div>
  )
}

export default Hero