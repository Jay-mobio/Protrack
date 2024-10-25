import mongoose from "mongoose";

const resourceTypeSchema = new mongoose.Schema({
    resource_type_name: {
        type: String,
        required: true
    },
    resource_type_label: {
        type: String,
        required: true
    },
    
}, { timestamps: true })

const ResourceType = mongoose.model('ResourceType',resourceTypeSchema)
export { ResourceType }