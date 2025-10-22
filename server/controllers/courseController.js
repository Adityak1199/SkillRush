import course from "../models/course.js";

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await course.find({isPublished: true});
        select(['-courseContent','-enrolledStudents']).populate({path: 'educator'});
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get courses by id
export const getCourseId = async (req, res) => {
    const {id} = req.params
    try {
        const courseData = await course.findById(id).populate({path: 'educator'});

        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if(!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            })
        })
        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


