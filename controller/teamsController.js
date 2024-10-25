import { Teams, TeamsAuditLog } from "../models/index.js";
import moment from "moment";
import { auditLogEntry } from "../utils/methods.js";

export const createTeam = async (req,res) =>{
    try{
        const data = req.body;        
        const existingTeam = await Teams.findOne({
            team_name: data.team_name,
            organisation_id: data.organisation_id
        })

        if (existingTeam){
            return res.status(404).json({error: "Team exists"})
        }
        const newTeam = new Teams({
            team_name: data.team_name,
            organisation_id: data.organisation_id
        })
        await newTeam.save();
        return res.json({data:newTeam})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getTeam = async (req,res) => {
    try {
        const existingTeam = await Teams.findById(req.params.id);
        if (!existingTeam){
            return res.status(404).json({error:"Team not found"})
        }
        return res.json({data: existingTeam})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getTeams = async (req,res) => {
    try {
        const teams = await Teams.find();
        return res.json({data: teams})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateTeam = async(req,res) => {
    try{
        const data = req.body
        const existingTeam = await Teams.findById(req.params.id)
        const team = await Teams.findByIdAndUpdate(
            {_id: req.params.id},
            {
                team_name: data.team_name,
                organisation_id: data.organisation_id
        },
        {new:true}
    );
        if (!team){
            return res.status(404).json({error: "Team not found"})
        }
        auditLogEntry(TeamsAuditLog,data,existingTeam,req.params.id,req.user._id, "UPDATE")
        return res.json({data:team})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteTeam = async(req,res) => {
    try{
        const team = await Teams.findByIdAndDelete(req.params.id)
        if (!team){
            return res.status(404).json({error: "Team not found"})
        }
        auditLogEntry(TeamsAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:team})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const getTeamsAuditLogs = async(req, res) => {
    try{
        logs = await TeamsAuditLog.find()
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
//         const auditLog  = new TeamsAuditLog({
//             action: action,
//             team_id: id,
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