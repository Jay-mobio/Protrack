import { OpportunityAuditLog, OpportunityTracker } from "../models/index.js";
import moment from "moment";
import mongoose from "mongoose";
import { auditLogEntry } from "../utils/methods.js";

export const createOpportunity = async (req,res) =>{
    try{
        const lastOpportunity = await OpportunityTracker.findOne({})
        .sort({ opportunity_id: -1 })  // Sort by opportunity_id in descending order
        .exec();

        let newOpportunityId;
        
        if (lastOpportunity) {
        // Extract the numeric part from the last opportunity_id and increment it
        const lastIdNum = parseInt(lastOpportunity.opportunity_id.split('-')[1]);
        newOpportunityId = `OP-${lastIdNum + 1}`;
        } else {
        // If no opportunity exists, start with OP-1
        newOpportunityId = 'OP-1';
        }
        const data = req.body;        
        const newOpportunity = new OpportunityTracker({
            opportunity_id: newOpportunityId,
            statement: data.statement,
            owner: data.owner,
            category: data.category,
            source: data.source,
            date_identified: data.date_identified,
            date_closed: data.date_closed,
            action_plan: data.action_plan,
            priority: data.priority,
            status: data.status,
            remarks: data.remarks
        })
        await newOpportunity.save();
        return res.json({data:newOpportunity})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getOpportunity = async (req,res) => {
    try {
        const existingOpportunity = await OpportunityTracker.findById(req.params.id);
        if (!existingOpportunity){
            return res.status(404).json({error:"Opportunity not found"})
        }
        return res.json({data: existingOpportunity})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getOpportunities = async (req,res) => {
    try {
        const opportunities = await OpportunityTracker.find();
        return res.json({data: opportunities})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateOpportunity = async(req,res) => {
    try{
        const data = req.body
        const existingOpportunity = await OpportunityTracker.findById(req.params.id)
        const opportunity = await OpportunityTracker.findByIdAndUpdate(
            {_id: req.params.id},
            {
                statement: data.statement,
                owner: data.owner,
                category: data.category,
                source: data.source,
                date_identified: data.date_identified,
                date_closed: data.date_closed,
                action_plan: data.action_plan,
                priority: data.priority,
                status: data.status,
                remarks: data.remarks
            },
        {new:true}
    );
        if (!opportunity){
            return res.status(404).json({error: "Opportunity not found"})
        }
        auditLogEntry(OpportunityAuditLog,data,existingOpportunity,req.params.id,req.user._id, "UPDATE")
        return res.json({data:opportunity})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteOpportunity = async(req,res) => {
    try{
        const opportunity = await OpportunityTracker.findByIdAndDelete(req.params.id)
        if (!opportunity){
            return res.status(404).json({error: "Opportunity not found"})
        }
        auditLogEntry(OpportunityAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:opportunity})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const getOpportunityAuditLogs = async(req, res) => {
    try{
        logs = await OpportunityAuditLog.find()
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
//                 let beforeValue = beforeData[field];
//                 let afterValue = data[field];

//                 // Normalize ObjectId and Date types
//                 if (typeof beforeValue === 'object' && beforeValue instanceof mongoose.Types.ObjectId) {
//                     beforeValue = beforeValue.toString();
//                 }
//                 if (typeof afterValue === 'object' && afterValue instanceof mongoose.Types.ObjectId) {
//                     afterValue = afterValue.toString();
//                 }
//                 if (beforeValue instanceof Date) {
//                     beforeValue = beforeValue.toISOString();
//                 }
//                 if (afterValue instanceof Date) {
//                     afterValue = afterValue.toISOString();
//                 }

//                 // Deep comparison for objects or arrays
//                 let isChanged;
//                 if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
//                     isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);
//                 } else {
//                     // Primitive comparison
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
        
//         const auditLog  = new OpportunityAuditLog({
//             action: action,
//             opportunity_id: id,
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