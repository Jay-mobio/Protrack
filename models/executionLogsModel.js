import mongoose from "mongoose";

const executionLogsSchema = new  mongoose.Schema({
    api_name: {
        type: String,
        required: true
    },
    last_executed:{
        type: Date,
        required: true
    }
});

const ExecutionLogs = mongoose.model('ExecutionLogs', executionLogsSchema)
export {ExecutionLogs}