import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // ✅ fixed `string` → `mongoose.Schema.Types.ObjectId`
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ fixed `string` → `mongoose.Schema.Types.ObjectId`
    Amount: { type: Number, required: true },
    Status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending'  },
}, { timestamps: true });

const purchase = mongoose.model('purchase', purchaseSchema);
export default purchase;