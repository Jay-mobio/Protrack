import mongoose from "mongoose";

const OpportunityTrackerSchema = new mongoose.Schema({
    opportunity_id: {
        type: String,
        unique: true,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming this refers to a User model
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    date_identified: {
        type: Date
    },
    date_closed: {
        type: Date
    },
    action_plan: {
        type: String
    },
    priority: {
        type: String
    },
    status: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    collection: 'opportunity_tracker',  // Collection name in the database
    versionKey: false,  // To disable the __v version field
});

const OpportunityTracker = mongoose.model('opportunity_tracker', OpportunityTrackerSchema);

const OpportunityAuditLogSchema = new mongoose.Schema({
    opportunity_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'opportunity_tracker',
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
const OpportunityAuditLog = mongoose.model('OpportunityAuditLog', OpportunityAuditLogSchema);
  
export {OpportunityTracker,OpportunityAuditLog}