import React, { useContext, useEffect, useState , } from "react"
import SearchBar from "../../components/student/SearchBar"
import { useNavigate, useParams } from "react-router-dom"
import CourseCard from "../../components/student/CourseCard"
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"
import Footer from "../../components/student/Footer"

const CoursesList = () => {
  const {navigate , allCourses} = useContext(AppContext)
  const { input } = useParams()

  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice() 
        input ?
        setFilteredCourses(
          tempCourses.filter(
         item => item.courseTitle.toLowerCase().includes(input.toLowerCase()) 
          )
        )
        : setFilteredCourses(tempCourses)
      }
    }, [allCourses, input])

  return (
    <div className="relative md:px-36 px-8 text-left pt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
          <p className="text-gray-500">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>{" "}
            / <span>Course List</span>
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar data={input} />
      </div>
      { input && <div className="inline-flex items-center gap-2 bg-gray-200 py-2 px-4 rounded ">
        <p> {input} </p>
        <img src={assets.cross_icon} alt="cross-icon" className="cursor-pointer" onClick={() => navigate('/course-list')}/> </div> }
      {/* Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
        { filteredCourses.map((course , index ) => <CourseCard key = {index} course = {course} />) }
      </div>
      <Footer />
    </div>
    
  )
}

export default CoursesList
