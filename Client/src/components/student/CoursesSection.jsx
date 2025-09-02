import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"

import CourseCard from './CourseCard'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Discover our top-rated courses and stay ahead of the curve in the ever-evolving world of technology.
      </p>

<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 my-10 px-4 md:px-0">
  {allCourses?.slice(0, 4).map((course) => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>


      <Link
        to="/course-list"
        onClick={() => window.scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-100 transition"
      >
        Show all courses
      </Link>
    </div>
  )
}

export default CoursesSection
