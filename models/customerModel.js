import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
  customer_code: {
    type: String,
    default: null,
  },
  customer_status: {
    type: String,
    default: null,
  },
  customer_spoc: {
    type: String,
    default: null,
  },
  customer_spoc_contact: {
    type: String,
    default: null,
  },
  customer_interaction_type: {
    type: String,
    default: null,
  },
  contract: {
    type: String,
    default: null,
  },
  contract_size: {
    type: String,
    default: null,
  },
  country_region: {
    type: String,
    default: null,
  },
  actual_start_date: {
    type: Date,
    default: null,
  },
  expected_start_date: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: null,
  },
  organisation_id: {
    type: Number,
    default: null,
  },
  customer_projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }]
}, { timestamps: true });


const Customer = mongoose.model('Customer', customerSchema);


const CustomerAuditLogSchema = new mongoose.Schema({
  customer_id: {
      type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
      ref: 'Customer',
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
const CustomerAuditLog = mongoose.model('CustomerAuditLog', CustomerAuditLogSchema);

export{ Customer, CustomerAuditLog};