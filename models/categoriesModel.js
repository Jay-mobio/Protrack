import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    user_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Categories = mongoose.model("Categories", categoriesSchema);

const CategoriesAuditLogSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user references another model
        ref: 'Categories',
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
const CategoriesAuditLog = mongoose.model('CategoriesAuditLog', CategoriesAuditLogSchema);
  
export{ Categories, CategoriesAuditLog};
