import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/course.js";
import course from "../models/course.js";
// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try{
        const userId = req.auth().userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role : "educator"
            }
        })
        res.json({success: true, message: "User role updated to educator"})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

//Add new course
export const addCourse = async (req, res) => {
    try{
        const courseDta = req.body;
        const imageFile = req.file;
        const educatorId = req.auth().userId;

        if(!imageFile){
            return res.status(400).json({success: false, message: "Image is required"})
        }
        const parsedCourseData = JSON.parse(courseDta);
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload =  await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();
        res.json({success: true, message: "Course added successfully"})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

export const getEducatorCourses = async (req, res) => {
    try{
        const educator = req.auth().userId;
        const Courses = await Course.find({educator: educator});
        res.json({success: true, Courses})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

// Get Educator Dashboard
export const educatorDashboardData = async (req, res) => {
    try{
        const educator = req.auth().userId;
        const Courses = await Course.find({educator: educator});
        const totalCourses = Courses.length;
        const courseIds = Courses.map((course) => course._id);

        // calculate total earnings
        const purchases = await purchase.find({
          courseId : {$in: courseIds},
          status: "success"
        }
        )
        const totalEarnings = purchases.reduce((acc, purchase) => acc + purchase.Amount, 0);
         
        // connect unique enrolled student IDs
        const enrolledStudentsData  = [];
        for(const course of Courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            },'name imageUrl');
            students.forEach((student) => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }


        res.json({success: true, dashboardData: {totalCourses, totalEarnings, enrolledStudentsData}})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

// Get enrolled student Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try{
       const educator = req.auth().userId;
       const Courses = await Course.find({educator: educator});
       const courseIds = Courses.map((course) => course._id);

      
       const purchases = await purchase.find({
           courseId : {$in: courseIds},
           status: "success"
       }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

       const enrolledStudents = purchases.map((purchase) => {
           student: student.userId ;
           courseTitle: purchase.courseId.courseTitle;
           purchaseData: purchase.createdAt;
       });
    res.json({success: true, enrolledStudents})

    }catch ( error ){
        res.json({success: false, message: err.message})
    }
}
