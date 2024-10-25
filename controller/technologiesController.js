import { Technologies, TechnologyAuditLog } from "../models/index.js";
import moment from "moment";
import { auditLogEntry } from "../utils/methods.js";

export const createTechnology = async (req,res) =>{
    try{
        const data = req.body;        
        const existingTechnologies = await Technologies.findOne({
            technology_name: data.technology_name,
            organisation_id: data.organisation_id
        })
              
        if (existingTechnologies){
            return res.status(404).json({error: "Technologies exists"})
        }
        const newTechnologies = new Technologies({
            technology_name: data.technology_name,
            organisation_id: data.organisation_id
        })
        await newTechnologies.save();
        return res.json({data:newTechnologies})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getTechnology = async (req,res) => {
    try {
        const existingTechnology = await Technologies.findById(req.params.id);
        if (!existingTechnology){
            return res.status(404).json({error:"Technology not found"})
        }
        return res.json({data: existingTechnology})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getTechnologies = async (req,res) => {
    try {
        const Technology = await Technologies.find();
        return res.json({data: Technology})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateTechnology = async(req,res) => {
    try{
        const data = req.body
        const existingTechnology = await Technologies.findById(req.params.id)
        const technology = await Technologies.findByIdAndUpdate(
            {_id: req.params.id},
            {
                technology_name: data.technology_name,
                organisation_id: data.organisation_id
        },
        {new:true}
    );
        if (!technology){
            return res.status(404).json({error: "Technology not found"})
        }
        
        auditLogEntry(TechnologyAuditLog,data,existingTechnology,req.params.id,req.user._id, "UPDATE")
        return res.json({data:technology})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteTechnologies = async(req,res) => {
    try{
        const technology = await Technologies.findByIdAndDelete(req.params.id)
        if (!technology){
            return res.status(404).json({error: "Technology not found"})
        }
        auditLogEntry(TechnologyAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:technology})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const getTechnologyAuditLogs = async(req, res) => {
    try{
        logs = await TechnologyAuditLog.find()
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
//                 if (typeof beforeValue === 'object' && beforeValue instanceof mongoose.Types.ObjectId) {
//                     beforeValue = beforeValue.toString();
//                 }
//                 if (typeof afterValue === 'object' && afterValue instanceof mongoose.Types.ObjectId) {
//                     afterValue = afterValue.toString();
//                 }

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
        
//         const auditLog  = new TechnologyAuditLog({
//             action: action,
//             technology_id: id,
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