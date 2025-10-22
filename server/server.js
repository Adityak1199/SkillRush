import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv/config';
import connectDB from "./config/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import course from "./models/course.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

// initialize express
const app = express();


// connect to db
await connectDB();
await connectCloudinary();

// middleware
app.use(cors());
app.use(express.json()); // Add this to parse JSON requests
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => res.send("API Working hi"));
app.post('/clerk',express.json(),clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter);
app.use('/api/course',express.json(),courseRouter);
app.use('/api/user',express.json(),userRouter);
app.post('/stripe',express.raw({type:'application/json'}), stripeWebhooks);

// Port
const PORT = process.env.PORT || 4000;
// console.log("Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // ✅ backticks for template literal
});

export default app

