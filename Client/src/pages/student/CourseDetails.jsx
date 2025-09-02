import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";

/**
 * CourseDetails
 * - pulls a course by :id from AppContext.allCourses
 * - renders title, meta, ratings
 * - shows thumbnail OR a YouTube player (autoplay) when a "Free preview" lecture is clicked
 * - collapsible chapters with durations
 * - right side purchase card (price, duration, lessons, rating)
 */
const CourseDetails = () => {
  const { id } = useParams();

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    currency,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  // fetch course by id when courses are ready
  useEffect(() => {
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      const found = allCourses.find((c) => String(c._id) === String(id));
      setCourseData(found || null);
    }
  }, [id, allCourses]);

  // guard while courses fetch
  if (!Array.isArray(allCourses) || allCourses.length === 0) {
    return <Loading />;
  }

  const toggleSection = (idx) =>
    setOpenSection((prev) => ({ ...prev, [idx]: !prev[idx] }));

  // YouTube embed options
  const ytOpts = {
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  // Safe helpers
  const fmtLectureTime = (mins) =>
    humanizeDuration((Number(mins) || 0) * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });

  if (!courseData) return <Loading />;

  const discounted =
    Number(courseData.coursePrice || 0) -
    (Number(courseData.discount || 0) * Number(courseData.coursePrice || 0)) /
      100;

  const totalLessons = calculateNoOfLecture(courseData);
  const totalDuration = calculateCourseDuration(courseData);
  const rating = calculateRating(courseData);
  const ratingCount = courseData?.courseRatings?.length || 0;
  const studentCount = courseData?.enrolledStudents?.length || 0;

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left bg-gradient-to-b from-cyan-100/70">
        {/* left column */}
        <div className="max-w-xl z-10 text-gray-600">
          {/* Title */}
          <h1 className="md:text-[34px] text-[26px] font-semibold text-gray-900">
            {courseData.courseTitle}
          </h1>

          {/* Short Description */}
          <p
            dangerouslySetInnerHTML={{
              __html: (courseData.courseDescription || "").slice(0, 200),
            }}
            className="pt-4 text-[18px] leading-7"
          ></p>

          {/* Rating + students */}
          <div className="flex flex-wrap items-center gap-3 pt-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{rating}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-3.5 h-3.5"
                  />
                ))}
              </div>
              <span className="text-blue-600">
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            </div>

            <div className="h-4 w-[1px] bg-gray-400/30" />

            <p>
              {studentCount} {studentCount === 1 ? "student" : "students"}
            </p>
          </div>

          {/* Instructor */}
          <p className="text-sm pt-2">
            Course by{" "}
            <span className="text-blue-600 underline">
              {courseData.instructorName || "GreatStack"}
            </span>
          </p>

          {/* Course Content */}
          <div className="pt-8 text-gray-900">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5">
              {(courseData.courseContent || []).map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-200 bg-white mb-3 rounded"
                >
                  {/* Header */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                    aria-expanded={!!openSection[index]}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="toggle"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-xs md:text-sm text-gray-500">
                      {(chapter.chapterContent || []).length} lectures •{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </button>

                  {/* Body */}
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      openSection[index] ? "max-h-[28rem]" : "max-h-0"
                    }`}
                  >
                    <ul className="md:pl-10 pl-4 pr-4 py-2 text-gray-700 border-t border-gray-200">
                      {(chapter.chapterContent || []).map((lecture, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-2 py-2"
                        >
                          <div className="flex items-start gap-2">
                            <img
                              src={assets.play_icon}
                              alt="play"
                              className="w-4 h-4 mt-1 shrink-0"
                            />
                            <div className="text-xs md:text-sm text-gray-800">
                              <p className="font-medium">
                                {lecture.lectureTitle}
                              </p>
                              <p className="text-gray-500">
                                {fmtLectureTime(lecture.lectureDuration)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {lecture.isPreviewFree && (
                              <button
                                className="text-blue-600 hover:underline text-xs md:text-sm"
                                onClick={() =>
                                  setPlayerData({
                                    videoId:
                                      (lecture?.lectureUrl || "")
                                        .split("/")
                                        .pop() || "",
                                  })
                                }
                              >
                                Free preview
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div className="py-16 text-sm md:text-base">
            <h3 className="text-xl font-semibold text-gray-900">
              Course Description
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription || "",
              }}
              className="pt-3 prose prose-sm max-w-none text-gray-700"
            />
          </div>
        </div>

        {/* right column / purchase card + player/thumbnail */}
        <div className="max-w-[424px] w-full shadow-[0px_4px_15px_0px_rgba(0,0,0,0.1)] z-10 rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {/* Video area: show YouTube if playerData, else thumb (➡️ same style as your screenshot) */}
          <div className="w-full">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={ytOpts}
                iframeClassName="w-full aspect-video"
              />
            ) : (
              <img
                src={courseData.courseThumbnail}
                alt="course-thumbnail"
                className="w-full object-cover"
              />
            )}
          </div>

          <div className="p-5">
            {/* Time-left ribbon */}
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time-left-clock-icon"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days</span> left at this price!
              </p>
            </div>

            {/* Price row */}
            <div className="flex flex-wrap gap-3 items-center pt-3">
              <p className="text-gray-900 md:text-4xl text-2xl font-semibold">
                {currency}
                {Number.isFinite(discounted)
                  ? discounted.toFixed(2)
                  : Number(courseData.coursePrice || 0).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency}
                {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                You save {courseData.discount}%
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex items-center flex-wrap gap-4 pt-3 md:pt-4 text-gray-500 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star-icon" />
                <p>{rating}</p>
              </div>

              <div className="h-4 w-[1px] bg-gray-500/40" />

              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="time-clock-icon" />
                <p>{totalDuration}</p>
              </div>

              <div className="h-4 w-[1px] bg-gray-500/40" />

              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson-icon" />
                <p>
                  {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button className="md:mt-6 mt-4 py-3 font-medium w-full bg-blue-600 hover:bg-blue-700 text-white rounded">
              {isAlreadyEnrolled ? "Continue Learning" : "Enroll Now"}
            </button>

            {/* What’s included */}
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-900">
                What's in this course
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-base text-gray-700 list-disc">
                <li>Lifetime access to the course</li>
                <li>Step-by-step, hands-on learning</li>
                <li>Downloadable resources</li>
                <li>Quizzes and assignments to test your knowledge</li>
                <li>Certification on successful completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
