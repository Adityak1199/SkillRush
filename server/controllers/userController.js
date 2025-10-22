import purchase  from "../models/purchase.js";
import User from "../models/Users.js";
import Stripe from "stripe";
import course from "../models/course.js";
import { courseProgress } from "../models/courseProgress.js";


// get user data
export const getUserData = async (req, res) => {
    try{
        const userId = req.auth().userId;
        const user = await User.findById(userId);
        
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

// user enrolled courses with lecture link
export const userEnrolledCourses = async (req, res) => {
    try{
        const userId = req.auth().userId;
        const user = await User.findById(userId).populate('enrolledCourses');
        
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, enrolledCourses: user.enrolledCourses})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}


export const purchaseCourse = async(req,res) => {
    try{
      const { courseId } = req.body;
      const { origin } = req.headers;
      const userId = req.auth().userId;
      const userData = await User.findById(userId); 
      const courseData = await course.findById(courseId);

      if(!userData || !courseData){
          return res.json({success: false, message: "User or course not found"})
      }
      const purchaseData =  {
          courseId: courseData._id,
          userId ,
          amount : (courseData.courcePrice - courseData.discount*courseData.courcePrice/100).toFixed(2),
      }
      const newPurchase = await purchase.create(purchaseData);
      
      //Stripe Gateway Iniialize
      const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
      const currency = process.env.CURRENCY.toLowerCase();

      // creating line items for stripe
      const line_items = [{
          price_data:{
            currency,
            product_data:{
                name: courseData.courseTitle
            },
            unit_amount :Math.floor(newPurchase.amount*100)
          },
          quantity: 1
      }]
      const session = await stripeInstance.checkout.sessions.create({
          success_url: `${origin}/loading/my-enrollments`,
          cancel_url: `${origin}/`,
          line_items:line_items ,
          mode: "payment",
          metadata: {
            purchaseId: newPurchase._id.toString(),
          }
      })
      res.json({success: true, session_url: session.url});

    }
    catch(error){

    }
}

// update user course progress
export const updateUserCourseProgress = async (req, res) => {
    try{
        const userId = req.auth().userId;
        const { courseId, lectureId } = req.body;
        const progressData = await courseProgress.findOne({
            userId,
            courseId
        })
        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: false, message: "Lecture already completed"})
            }
                progressData.lectureCompleted.push(lectureId);
                await progressData.save();
                return res.json({success: true, message: "Lecture completed successfully"})
        }else{
            await courseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
            return res.json({success: true, message: "Lecture completed successfully"})
        }
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

// get user course progress
export const getUserCourseProgress = async (req, res) => {
    try{
        const userId = req.auth().userId;
        const { courseId } = req.params;
        const progressData = await courseProgress.findOne({
            userId,
            courseId
        })
        res.json({success: true, progressData})
    }catch(err){
        res.json({success: false, message: err.message})
    }
}

// add user ratings to course
export const addUserRating = async (req, res) => {
        const userId = req.auth().userId;
        const { courseId, rating } = req.body;
        if(!courseId || !rating || !userId || rating<1 || rating>5){
            return res.json({success: false, message: "Course id and rating is required"})
        }
    try{
        const Course = await course.findById(courseId);
        if(!Course){
            return res.json({success: false, message: "Course not found"})
        }
        const courseData = await course.findById(courseId);
        
        const user = await User.findById(userId);
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message: "You are not enrolled in this course"})
        }
        
        const existingRating = courseData.ratings.findIndex(r => r.userId === userId);
        if(existingRating !== -1){
            courseData.ratings[existingRating].rating = rating;
            await courseData.save();
            return res.json({success: true, message: "Rating updated successfully"})
        }
        else{
            course.courseRating.push({
                userId,
                rating
            })
            await courseData.save();
            return res.json({success: true, message: "Rating added successfully"})
        }
    }catch(err){
        res.json({success: false, message: err.message})
    }
}