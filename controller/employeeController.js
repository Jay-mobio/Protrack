import axios from "axios";
import bcrypt from 'bcrypt'
import { Department, Employee, EmployeeAuditLog, Organisation, ResourceType, Skills, Status } from "../models/index.js";
import { auditLogEntry, errorResponse, successResponse } from "../utils/methods.js";

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
        return res.status(200).json(successResponse(employeeAddedCount));
    } catch (error){
        return res.status(500).json(errorResponse("Internal Server Error"))
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
        return res.json(successResponse(emaployee));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"))
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
            return res.status(404).json(errorResponse("Employee not found"))
        }
        
        auditLogEntry(EmployeeAuditLog,data,existingEmployee,id,req.user._id, "UPDATE")
        return res.json(successResponse(updated_emaployee));
    }catch(err){
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
};

export const getEmployee = async(req, res) => {
    try {
        const emaployeeId = req.params.id;
        const emaployee = await Employee.findById(emaployeeId);
        if (!emaployee) {
            return res.status(404).json(errorResponse("Employee not found"))
        }
        return res.json(successResponse(emaployee));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getEmployees = async(req, res) => {
    try {
        const emaployees = await Employee.find({organisation_id: req.params.organisation_id});
        return res.json(successResponse(emaployees));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
};

export const getEmployeeAuditLogs = async(req, res) => {
    try{
        logs = await EmployeeAuditLog.find()
        return res.json(successResponse(logs));
    } catch(error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const deleteemaployee = async(req,res) => {
    try{
        const emaployee = await Employee.findByIdAndDelete(req.params.id)
        if (!emaployee){
            return res.status(404).json(errorResponse("Employee not found"))
        }
        auditLogEntry(EmployeeAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json(successResponse(emaployee));
    } catch(error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
};

export const getResourceTypeMetadata = async (req,res) =>{
    try{        
        const resources_type = await ResourceType.find()
        return res.json(successResponse(resources_type))
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"));
    }
}

export const getStatusMetadata = async (req,res) =>{
    try{
        const status = await Status.find();
        return res.json(successResponse(status));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"));
    }
}

export const getDepartmentMetadata = async (req,res) =>{
    try{
        const department = await Department.find();
        return res.json(successResponse(department));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"));
    }
    
}

export const getSkillsMetadata = async (req,res) =>{
    try{
        const skills = await Skills.find();
        return res.json(successResponse(skills));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"));
    }
    
}

export const getOrganisationMetadata = async (req,res) =>{
    try{
        const orgs = await Organisation.find();
        return res.json(successResponse(orgs));
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse("Internal Server Error"));
    }
    
}

export const getReportingManagerMetadata = async (req,res) =>{
    const { organisation_id } = req.params;

    try {
        const users = await Employee.find({
            $or: [{ deleted: null }, { deleted: "0" }],
            organisation_id: organisation_id,
            email: { $ne: "" }
        }).sort({ id: 1 });

        return res.json(successResponse(users));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json(errorResponse("Internal Server Error"));
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