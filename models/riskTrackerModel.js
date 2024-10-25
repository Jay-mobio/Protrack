import mongoose from "mongoose";

const RiskTrackerSchema = new mongoose.Schema({
    risk_name: {
        type: String,
        required: true
    },
    risk_code: {
        type: String
    },
    risk_description: {
        type: String
    },
    risk_type: {
        type: String
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    project_manager: {
        type: mongoose.Schema.Types.ObjectId,  // Refers to a User model
        ref: 'User'
    },
    risk_identified_on: {
        type: Date
    },
    risk_category: {
        type: String
    },
    risk_consequence: {
        type: String
    },
    risk_impact: {
        type: Number
    },
    risk_probability: {
        type: Number
    },
    risk_exposure: {
        type: Number
    },
    risk_treatment: {
        type: String
    },
    mitigation_plan: {
        type: String
    },
    contingency_plan: {
        type: String
    },
    risk_owner: {
        type: String
    },
    last_reviewed_date: {
        type: Date
    },
    date_closed: {
        type: Date
    },
    remarks: {
        type: String
    },
    deleted: {
        type: Number,
        default: 0  // Assuming 0 means not deleted and 1 means deleted
    },
    risk_status: {
        type: String
    },
    organisation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation'
    }
}, {
    collection: 'risk_tracker',  // MongoDB collection name
    versionKey: false  // Disable __v version field
});

// Creating the RiskTracker model
const RiskTracker = mongoose.model('RiskTracker', RiskTrackerSchema);

const RiskTrackerAuditLogSchema = new mongoose.Schema({
    risk_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'RiskTracker',
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'User',
        required: false
    },
    field_changed: {
        type: String,
        required: false
    },
    from_value: {
        type: mongoose.Schema.Types.Mixed,  // Any data type can go here
        required: false
    },
    to_value: {
        type: mongoose.Schema.Types.Mixed,  // Any data type can go here
        required: false
    },
    date_updated: {
        type: Date,
        default: Date.now,  // Automatically sets the current date
        required: false
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming updated_by refers to a user
        ref: 'User',
        required: false
    },
    action: {
        type: String,
        required: false
    }
  });
  
  // Create a model from the schema
const RiskTrackerAuditLog = mongoose.model('RiskTrackerAuditLog', RiskTrackerAuditLogSchema);

export {RiskTracker, RiskTrackerAuditLog}
