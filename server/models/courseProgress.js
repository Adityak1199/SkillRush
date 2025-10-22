import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ✅ fixed `string` → `mongoose.Schema.Types.ObjectId`
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ✅ fixed `string` → `mongoose.Schema.Types.ObjectId`
    completed: { type: Boolean, default: false },
    lectureCompleted: []
}, { minimize: false });

export const courseProgress = mongoose.model('courseProgress', courseProgressSchema);