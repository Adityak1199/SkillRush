import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='bg-gray-900 w-full'>
      <footer className='bg-gray-900 md:px-39 text-left w-full mt-10'>
        <div className=' flex flex-col md:flex-row items-start px-8 md:px-0 justify-between gap-10 md:gap-32 py-10 border-b border-white/30'>
      <div className='flex flex-col md:items-start items-center w-full'>
        <img src={assets.logo_dark} alt="logo" />
        <p className='mt-6 text-center md:text-left text-sm text-white/80'>Lorem Lorem, ipsum.ipsum dolor sit amet consectetur adipisicing elit .omnis corporis laboriosam labore ab corrupti, quos molestiae laudantium dolor. Mollitia, nesciunt.</p>
      </div>
      <div className=' flex flex-col md:items-start items-center w-full'>
        <h2 className='font-semibold text-white mb-5'>Company</h2>
        <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
          <li><a href="#">Home</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Contact us</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
      <div className='hidden md:flex flex-col items-start  w-full'>
        <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter and stay updated </h2>
        <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly</p>
        <div className='flex items-center gap-2 pt-4'>
          <input type="email" placeholder="Enter your email" className="border border-gray-500/30 bg-gray-800 text-gray-400 placeholder:text-gray-400 outline-none w-64 h-8 rounded px-2 text-sm" />
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded">
            Subscribe
          </button>
        </div>
      </div>
        </div>
        <p className='text-white/60 text-center py-5 md:text-sm text-xs'>copyright 2025 @ SkillRush . All Rights Reserved</p>
      </footer>
    </div>
  )
}

export default Footer