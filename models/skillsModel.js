import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
    skill_name: {
        type: String,
        required: true
    },
    organisation: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Skills = mongoose.model('Skills', skillsSchema);
export {Skills}