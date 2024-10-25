import mongoose from 'mongoose';

// Define the TeamMember schema
const teamMemberSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  resource_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming USER_ID refers to the User model
  role: { type: String, required: true },
  role_details: { type: String },
  billing_type: { type: String },
  allocated_date: { type: Date, default: Date.now },
  status: { type: String },
  amount: { type: Number },
  currency: { type: String },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the TeamMember model
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export {TeamMember};
