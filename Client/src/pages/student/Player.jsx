import React, { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import Loading from "../../components/student/Loading"
import { assets } from "../../assets/assets"
import humanizeDuration from "humanize-duration"
import YouTube from "react-youtube"
import Footer from "../../components/student/Footer"
import Rating from "../../components/student/Rating"

const Player = () => {
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)   // ✅ define state
  const { enrolledCourses } = useContext(AppContext)

  const getCourseData = () => {
    const found = enrolledCourses.find(
      (course) => String(course._id) === String(courseId)
    )

    if (found) {
      setCourseData(found)
    }
  }

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses, courseId])

  if (!courseData) {
    return <Loading />
  }

  return (
    <>
    <div className="py-10 mt-10 px-6 md:px-16 lg:px-32 flex flex-col lg:flex-row gap-10">

      <div className="w-full lg:w-2/5 bg-white shadow-md mr-10 rounded-lg p-4 h-fit">
        <h3 className="text-lg font-semibold mb-5">Course Structure</h3>
        {courseData.courseContent.map((chapter, index) => (
          <div key={index} className="mb-5">
            <h4 className="font-semibold text-gray-800">{chapter.chapterTitle}</h4>
            <ul className="ml-5 mt-2 space-y-2">
              {chapter.chapterContent.map((lecture, i) => (
                <li
                  key={i}
                  onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} 
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src={assets.play_icon} alt="Play" className="w-4 h-4" />
                    <span>{lecture.lectureTitle}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {humanizeDuration(lecture.lectureDuration * 60000, { units: ["m"], round: true })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
  <div className="mt-5 flex items-center gap-3 py-3">
  <h1 className="text-xl font-bold">Rate this course: </h1>
  {/* Simplified and cleaner implementation */}
  <Rating initialValue={0} /> 
</div>

      </div>
      {/* right part  */}
      <div className="md:mt-10 px-10 lg:w-2/3">
        {playerData ? (
          <div>
            <YouTube
              videoId={playerData.lectureUrl.split("/").pop()}
              iframeClassName="w-full aspect-video"
            />
            <div className="flex justify-between items-center mt-1">
              <p>
                {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
              </p>
              <button className="text-blue-600">
                {false ? "Completed" : "Mark Completed"}
              </button>
            </div>
          </div>
        ) : (
          <img
            src={courseData ? courseData.courseThumbnail : ""}
            alt="player"
          />
        )}
      </div>
      
    </div>
    <Footer />
    </>
   
  )
}

export default Player
