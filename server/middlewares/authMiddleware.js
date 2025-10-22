import { clerkClient } from "@clerk/express";

//Middleware
export const protectEducator = async (req, res, next) => {
    try{
        const userId = req.auth().userId;
        const response = await clerkClient.users.getUser(userId);
        if(response.publicMetadata.role !== "educator"){
            return res.json({success: false, message: "You are not an educator"})
        }
        next();
    }catch(err){
        res.json({success: false, message: err.message})
    }
}