import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    status_label: {
        type: String,
        required: true
    },
    user_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Status = mongoose.model("Status", statusSchema);

  
export{ Status};
