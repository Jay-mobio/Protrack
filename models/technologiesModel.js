import mongoose from "mongoose";

const technologiesSchema = new mongoose.Schema({
  technology_name: {
    type: String,
    required: true
  },
  organisation_id: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Technologies = mongoose.model('Technologies', technologiesSchema);

const TechnologyAuditLogSchema = new mongoose.Schema({
  technology_id: {
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
const TechnologyAuditLog = mongoose.model('TechnologyAuditLog', TechnologyAuditLogSchema);

export{ Technologies, TechnologyAuditLog};