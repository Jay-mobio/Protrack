import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true
    },
    department_label: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export {Department}