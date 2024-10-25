import mongoose from "mongoose";

// Define the schema
const projectMatrixReportSchema = new mongoose.Schema({
    project_id: { type: String, required: true },
    assignee_id: { type: String, required: true },
    name: { type: String, required: true },
    estimate: { type: Number },
    capacity: { type: Number },
    duration: { type: Number }, // Float is generally stored as Number in JS
    duration_range: { type: String },
    dev_defects: { type: Number, default: 0 },
    delivery_defects: { type: Number, default: 0 },
    review_defects: { type: Number, default: 0 },
    total_defects: { type: Number, default: 0 },
    capacity_utilization: { type: Number }, // Float
    effort_variances: { type: Number }, // Float
    defect_leakage: { type: Number }, // Float
    defect_density: { type: Number }, // Float
    review_effictiveness: { type: Number }, // Float
    root_cause: { type: String },
    corrective_action: { type: String },
    preventive_action: { type: String }
}, { timestamps: true });

// Create and export the model
const ProjectMatrixReport = mongoose.model('ProjectMatrixReport', projectMatrixReportSchema);

const ProjectMetricsAuditLogSchema = new mongoose.Schema({
    log_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'ProjectMatrixReport',
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
  const ProjectMetricsAuditLog = mongoose.model('ProjectMetricsAuditLog', ProjectMetricsAuditLogSchema);

export{ ProjectMatrixReport, ProjectMetricsAuditLog};
