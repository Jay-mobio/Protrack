import mongoose, { modelNames, Schema } from "mongoose";

const organisationSchema = new mongoose.Schema({
    organisation_name: {
        type: String,
        required: true
    }
})

const Organisation = mongoose.model('Organisation', organisationSchema);
export {Organisation}