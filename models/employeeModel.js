import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  phone_number: { type: String, default: null },
  roles: { type: String, default: null },
  billing_type: { type: String, default: "Non Billable" },
  team: { type: Number, default: null },
  department: { type: Number, default: null },
  job_title: { type: String, default: null },
  skill_set: { type: String, default: "" },
  resource_type: { type: String, default: null },
  availability: { type: Number, default: null },
  resource_id: { type: String, default: null },
  status: { type: String, default: "2" },
  username: { type: String, default: null },
  password: { type: String, default: null },
  technologies_known: { type: String, default: "" },
  reporting_manager: { type: Number, default: null },
  experience: { type: String, default: null },
  category_id: { type: Number, default: null },
  band: { type: String, default: null },
  rate: { type: Number, default: null },
  currency: { type: String, default: null },
  resume_link: { type: String, default: null },
  linked_docs: { type: String, default: null },
  deleted: { type: Number, default: null },
  clickup_id: { type: Number, default: null },
  organisation_id: { type: Number, default: null }
}, { timestamps: true });


const Employee = mongoose.model('Employee', employeeSchema);

const EmployeeAuditLogSchema = new mongoose.Schema({
  employee_id: {
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
const EmployeeAuditLog = mongoose.model('EmployeeAuditLog', EmployeeAuditLogSchema);

export {Employee,EmployeeAuditLog}
