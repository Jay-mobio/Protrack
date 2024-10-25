import axios from "axios";
import bcrypt from 'bcrypt'
import { Employee, EmployeeAuditLog } from "../models/index.js";
import { auditLogEntry } from "../utils/methods.js";

const BASE_URL = process.env.CLICKUP_BASE_URL
const TOKEN = process.env.CLICKUP_AUTH_TOKEN

export const getClickupEmployees = async (req,res) =>{
    try{        
        const emaployeesRes = await axios.get(`${BASE_URL}/api/v2/team`,{
            headers:{Authorization:TOKEN}
        });
        let employeeAddedCount = 0
        for (const emaployee of emaployeesRes.data.teams){
            console.log("sd;fbskdbcffk");
            
            for (const team of emaployee.members){
                let emaployeename = team.emaployee.emaployeename
                let email = team.emaployee.email
                let clickup_id = team.emaployee.id
                let fullname = emaployeename.split(' ')
                let salt = await bcrypt.genSalt(10);
                let password = await bcrypt.hash("Mobio@#123",salt)
                let existingEmployee = await Employee.findOne({email: email})
                if (!existingEmployee){
                const employee = new Employee({
                    email: email,
                    first_name: fullname[0],
                    last_name: fullname[1],
                    emaployeename: emaployeename,
                    password: password,
                    clickup_id: clickup_id
                })
                employee.save();
                employeeAddedCount++;
            }
            }
        }
        return res.status(200).json({data:employeeAddedCount});
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const createEmployee = async (req, res) => {
    try {
        const existingEmployee = await Employee.findOne({ email: req.body.email });
        const data = req.body
        if (existingEmployee) {
            return res.status(409).json({ error: "Employee with this email already exists" });
        }

        const emaployee = new Employee({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            clickup_id: data.clickup_id,
            job_title: data.job_title,
            emaployeename: data.emaployeename,
            password: data.password,
            roles: data.roles,
            phone_number: data.phone_number,
            team: data.team,
            department: data.department,
            billing_type: data.billing_type,
            skill_set: data.skill_set,
            resource_type: data.resource_type,
            availability: data.availability,
            resource_id: data.resource_id,
            organisation_id: data.organisation_id,
            status: data.status
        });
        const salt = await bcrypt.genSalt(10);
        emaployee.password = await bcrypt.hash(emaployee.password,salt)

        await emaployee.save();
        return res.json({ msg: "Employee added successfully", emaployee: emaployee });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateEmployee = async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body
        const existingEmployee = await Employee.findById(id)
        const updated_emaployee = await Employee.findByIdAndUpdate(
            {_id:id},{
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number,
                roles: data.roles,
                billing_type: data.billing_type,
                team: data.team,
                department: data.department,
                job_title: data.job_title,
                skill_set: data.skill_set,
                resource_type: data.resource_type,
                availability: data.availability,
                resource_id: data.resource_id,
                status: data.status,
                username: data.username,
                password: data.password,
                technologies_known: data.technologies_known,
                reporting_manager: data.reporting_manager,
                experience: data.experience,
                category_id: data.category_id,
                band: data.band,
                rate: data.rate,
                currency: data.currency,
                resume_link: data.resume_link,
                linked_docs: data.linked_docs,
                deleted: data.deleted,
                clickup_id: data.clickup_id,
                organisation_id: data.organisation_id 
            },
            {new: true});
        if (!updated_emaployee){
            return res.status(404).json({error: "Employee not found"});
        }
        
        auditLogEntry(EmployeeAuditLog,data,existingEmployee,id,req.user._id, "UPDATE")
        return res.json({"updated_emaployee": updated_emaployee});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

export const getEmployee = async(req, res) => {
    try {
        const emaployeeId = req.params.id;
        const emaployee = await Employee.findById(emaployeeId);
        if (!emaployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({ emaployee });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getEmployees = async(req, res) => {
    try {
        const emaployees = await Employee.find();
        return res.json({ emaployees });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getEmployeeAuditLogs = async(req, res) => {
    try{
        logs = await EmployeeAuditLog.find()
        return res.json({data: logs})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteemaployee = async(req,res) => {
    try{
        const emaployee = await Employee.findByIdAndDelete(req.params.id)
        if (!emaployee){
            return res.status(404).json({error: "Employee not found"})
        }
        auditLogEntry(EmployeeAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:emaployee})
    } catch(error){
        res.status(500).json({error: error.message})
    }
};

// async function aduitLogEntry(data, beforeData, id, emaployeeID, action) {
//     try {        
//         if (action === "DELETE") {
//             await auditLogDataInsert(id, "DELETE", "", "", "", emaployeeID);
            
//         } else {
//             for (let field in data) {
//                 let isChanged;
//                 const beforeValue = beforeData[field];
//                 const afterValue = data[field];

//                 isChanged = beforeValue !== afterValue;

//                 // Only log if values are different
//                 if (isChanged) {
//                     await auditLogDataInsert(id, "UPDATE", field, beforeValue, afterValue, emaployeeID);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error in addAuditLogDataInsert: ${error}`);
//     }
// }

// async function auditLogDataInsert(id, action, field, beforeValue, afterValue, userID){
//     try{
        
//         const auditLog  = new EmployeeAuditLog({
//             action: action,
//             emaployee: id,
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