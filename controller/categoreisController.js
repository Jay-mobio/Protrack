import { Categories, CategoriesAuditLog} from "../models/index.js";
import { auditLogEntry } from "../utils/methods.js";

export const createCategory = async (req,res) =>{
    try{
        const data = req.body;        
        const existingCategory = await Categories.findOne({
            category_name: data.category_name,
            user_category: data.user_category
        })

        if (existingCategory){
            return res.status(404).json({error: "Category exists"})
        }
        const newCategory = new Categories({
            category_name: data.category_name,
            user_category: data.user_category
        })
        await newCategory.save();
        return res.json({data:newCategory})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getCategory = async (req,res) => {
    try {
        const existingCategory = await Categories.findById(req.params.id);
        if (!existingCategory){
            return res.status(404).json({error:"Category not found"})
        }
        return res.json({data: existingCategory})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getCategories = async (req,res) => {
    try {
        const category = await Categories.find();
        return res.json({data: category})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateCategory = async(req,res) => {
    try{
        const data = req.body
        const existingCategory = await Categories.findById(req.params.id)
        const category = await Categories.findByIdAndUpdate(
            {_id: req.params.id},
            {
                category_name: data.category_name,
                user_category: data.user_category
        },
        {new:true}
    );
        if (!category){
            return res.status(404).json({error: "Category not found"})
        }
        auditLogEntry(CategoriesAuditLog,data,existingCategory,req.params.id,req.user._id, "UPDATE")
        return res.json({data:category})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteCategory = async(req,res) => {
    try{
        const category = await Categories.findByIdAndDelete(req.params.id)
        if (!category){
            return res.status(404).json({error: "Category not found"})
        }
        auditLogEntry(CategoriesAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:category})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const getCategroyAuditLogs = async(req, res) => {
    try{
        const logs = await CategoriesAuditLog.find({category_id: req.params.id})
        return res.json({data: logs})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

// async function aduitLogEntry(data, beforeData, id, userID, action) {
//     try {
//         if (action === "DELETE") {
//             await auditLogDataInsert(id, "DELETE", "", "", "", userID);
            
//         } else {
//             for (let field in data) {
//                 const beforeValue = beforeData[field];
//                 const afterValue = data[field];
                
//                 let isChanged;

//                 // Check if both values are objects or arrays
//                 if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
//                     // Use JSON.stringify to compare objects/arrays
//                     isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);
//                 } else {
//                     // Use !== for primitive types
//                     isChanged = beforeValue !== afterValue;
//                 }


//                 // Only log if values are different
//                 if (isChanged) {
//                     await auditLogDataInsert(id, "UPDATE", field, beforeValue, afterValue, userID);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error in addAuditLogDataInsert: ${error}`);
//     }
// }

// async function auditLogDataInsert(id, action, field, beforeValue, afterValue, userID){
//     try{
        
//         const auditLog  = new CategoriesAuditLog({
//             action: action,
//             category_id: id,
//             user_id: userID,
//             field_changed: field,
//             from_value: beforeValue,
//             to_value: afterValue,
//             updated_by: userID,
//             date_updated: moment().toDate()
//         });
//         await auditLog.save();
//     } catch(error){
//         console.error(`Error in addAuditLogDataInsert: ${error}`);
//     }
// }
