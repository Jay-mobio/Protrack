import mongoose from 'mongoose';

// Define the schema
const projectSchema = new mongoose.Schema({
  project_id: { type: String, default: null },
  project_name: { type: String, required: true },
  expected_start_date: { type: Date, default: null },
  expected_end_date: { type: Date, default: null },
  actual_start_date: { type: Date, default: null },
  actual_end_date: { type: Date, default: null },
  project_code: { type: String, default: null },
  manager_id: { type: Number, default: null },
  owner_id: { type: Number, default: null },
  organisation_id: { type: Number, default: null },
  project_type: { type: mongoose.Schema.Types.Mixed, default: null }, // Define specific types if you have a separate schema for Projecttype
  cost_type: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for CostType
  currency: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for Currency
  amount: { type: Number, default: null },
  status: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for Status
  health: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for Health
  estimated_efforts: { type: String, default: null },
  actual_efforts: { type: String, default: null },
  contract_link: { type: String, default: null },
  engagement_type: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for EngagementType
  consulted: { type: String, default: null },
  account_manager_id: { type: Number, default: null },
  project_spoc: { type: String, default: null },
  spoc_contact: { type: String, default: null },
  customer_id: { type: Number, default: null },
  space_id: { type: String, default: null },
  interactions_types: { type: mongoose.Schema.Types.Mixed, default: null }, // Same for InteractionsType
  accountable: { type: String, default: null },
  informed: { type: String, default: null },
  project_folder: { type: String, default: null },
  resources: { type: [Number], default: [] },
  created_by: { type: Number, default: null }
});

const Project = mongoose.model('Project', projectSchema);

const ProjectAuditLogSchema = new mongoose.Schema({
  project_id: {
      type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
      ref: 'Project',
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
const ProjectAuditLog = mongoose.model('ProjectAuditLog', ProjectAuditLogSchema);

export{ Project, ProjectAuditLog};
