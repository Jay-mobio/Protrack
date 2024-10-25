import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

const UserAuditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'User',
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
const UserAuditLog = mongoose.model('UserAuditLog', UserAuditLogSchema);

export {User, UserAuditLog}