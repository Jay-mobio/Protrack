import mongoose from "mongoose";

const teamsSchema = new mongoose.Schema({
    team_name:{
        type: String,
        required: true
    },
    organisation_id:{
        type: Number,
        required: true
    }
});

const Teams = mongoose.model("Teams", teamsSchema);

const TeamsAuditLogSchema = new mongoose.Schema({
    team_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'Teams',
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
const TeamsAuditLog = mongoose.model('TeamsAuditLog', TeamsAuditLogSchema);

export { Teams, TeamsAuditLog };