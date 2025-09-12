import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv/config';
import connectDB from "./confing/mongodb";
import { clerkWebhooks } from "./controllers/webhooks.js";

// initialize express
const app = express();


// connect to db
await connectDB();

// middleware
app.use(cors());
app.use(express.json()); // Add this to parse JSON requests

// Routes
app.get('/', (req, res) => res.send("API Working hi"));
app.post('/clerk',express.json(),clerkWebhooks)

// Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // ✅ backticks for template literal
});


