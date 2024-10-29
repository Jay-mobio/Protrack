import { RiskTracker, RiskTrackerAuditLog } from "../models/index.js";
import { auditLogEntry } from "../utils/methods.js";

export const createRisk = async (req,res) =>{
    try{
        const data = req.body;
        const lastRisk = await RiskTracker.findOne({})
        .sort({ opportunity_id: -1 })  // Sort by opportunity_id in descending order
        .exec();

        let newRiskID;
        
        if (lastRisk) {
        // Extract the numeric part from the last opportunity_id and increment it
        const lastIdNum = parseInt(lastRisk.risk_code.split('-')[1]);
        newRiskID = `RISK-${lastIdNum + 1}`;
        } else {
        // If no opportunity exists, start with OP-1
        newRiskID = 'RISK-1';
        }      
        const newRisk = new RiskTracker({
            risk_name: data.risk_name,
            risk_code: newRiskID,
            risk_description: data.risk_description,
            risk_type: data.risk_type,
            project_id: data.project_id,
            department_id: data.department_id,
            project_manager: data.project_manager,
            risk_identified_on: data.risk_identified_on,
            risk_category: data.risk_category,
            risk_consequence: data.risk_consequence,
            risk_impact: data.risk_impact,
            risk_probability: data.risk_probability,
            risk_exposure: data.risk_exposure,
            risk_treatment: data.risk_treatment,
            mitigation_plan: data.mitigation_plan,
            contingency_plan: data.contingency_plan,
            risk_owner: data.risk_owner,
            last_reviewed_date: data.last_reviewed_date,
            date_closed: data.date_closed,
            remarks: data.remarks,
            deleted: data.deleted,
            risk_status: data.risk_status,
            organisation_id: data.organisation_id
        })
        await newRisk.save();
        return res.json({data:newRisk})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getRisk = async (req,res) => {
    try {
        const existingRisk = await RiskTracker.findById(req.params.id);
        if (!existingRisk){
            return res.status(404).json({error:"Risk not found"})
        }
        return res.json({data: existingRisk})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getRisks = async (req,res) => {
    try {
        const risks = await RiskTracker.find();
        return res.json({data: risks})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateRisk = async(req,res) => {
    try{
        const data = req.body
        const existingRisk = await RiskTracker.findById(req.params.id);
        const risk = await RiskTracker.findByIdAndUpdate(
            {_id: req.params.id},
            {
                risk_name: data.risk_name,
                risk_description: data.risk_description,
                risk_type: data.risk_type,
                project_id: data.project_id,
                department_id: data.department_id,
                project_manager: data.project_manager,
                risk_identified_on: data.risk_identified_on,
                risk_category: data.risk_category,
                risk_consequence: data.risk_consequence,
                risk_impact: data.risk_impact,
                risk_probability: data.risk_probability,
                risk_exposure: data.risk_exposure,
                risk_treatment: data.risk_treatment,
                mitigation_plan: data.mitigation_plan,
                contingency_plan: data.contingency_plan,
                risk_owner: data.risk_owner,
                last_reviewed_date: data.last_reviewed_date,
                date_closed: data.date_closed,
                remarks: data.remarks,
                deleted: data.deleted,
                risk_status: data.risk_status,
                organisation_id: data.organisation_id
            },
        {new:true}
    );
        if (!risk){
            return res.status(404).json({error: "Risk not found"})
        }
        auditLogEntry(RiskTrackerAuditLog,data,existingRisk,req.params.id,req.user._id, "UPDATE")
        return res.json({data:risk})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteRisk = async(req,res) => {
    try{
        const risk = await RiskTracker.findByIdAndDelete(req.params.id)
        if (!risk){
            return res.status(404).json({error: "Risk not found"})
        }
        auditLogEntry(RiskTrackerAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:risk})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const getRiskAuditLogs = async(req, res) => {
    try{
        logs = await RiskTrackerAuditLog.find()
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
        
//         const auditLog  = new RiskTrackerAuditLog({
//             action: action,
//             risk_id: id,
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