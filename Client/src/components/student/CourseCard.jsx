import React, { useContext } from 'react'
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency , calculateRating } = useContext(AppContext)

  const finalPrice = (course.coursePrice - (course.discount / 100) * course.coursePrice).toFixed(2)

  return (
    <Link to={'/course/'+course._id} onClick={() => window.scrollTo(0, 0)} className='border border-gray-500/30 rounded-lg overflow-hidden pb-5'>
      <img className='w-full' src={course.courseThumbnail} alt={course.courseTitle} />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        <p className='text-gray-500'>GreatStack</p>
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star  : assets.star_blank} alt="star"  className='w-3.5 h-3.5'/>
            ))}
          </div>
          <p className='text-gray-500 '>{course.courseRatings.length}</p>
        </div>
        <p className='texr-base font-semibold text-gray-800'>{currency}{finalPrice}</p>
      </div>
    </Link>
  )
}

export default CourseCard
