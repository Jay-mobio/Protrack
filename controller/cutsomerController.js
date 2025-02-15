import { Customer, CustomerAuditLog } from "../models/index.js";
import { auditLogEntry, errorResponse, successResponse } from "../utils/methods.js";

export const createCutsomer = async (req,res) =>{
    try{
        const data = req.body;        
        const existingCustomer = await Customer.findOne({cutsomer_code: data.customer_code})
        console.log(existingCustomer);
              
        if (existingCustomer){
            return res.status(404).json(errorResponse("Customer already exists"))
        }
        const newCustomer = new Customer({
            customer_name: data.customer_name,
            customer_code: data.customer_code,
            customer_spoc: data.customer_spoc,
            customer_spoc_contact: data.customer_spoc_contact,
            country_region: data.country_region,
            organisation_id: data.organisation_id
        })
        await newCustomer.save();
        return res.json(successResponse(newCustomer))
    } catch (error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const getCustomer = async (req,res) => {
    try {
        const existingCustomer = await Customer.findById(req.params.id);
        if (!existingCustomer){
            return res.status(404).json(errorResponse("Customer Not Found"))
        }
        return res.json(successResponse(existingCustomer))
    } catch (error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const getCustomers = async (req,res) => {
    try {
        const organisation_id = req.params.id
        const customers = await Customer.find({
            $or: [{ deleted: null }],
            organisation_id: organisation_id
        });
        return res.json(successResponse(customers))
    } catch (error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const updateCustomers = async(req,res) => {
    try{
        const data = req.body
        const existingCustomer = await Customer.findById(req.params.id);
        const customer = await Customer.findByIdAndUpdate(
            {_id: req.params.id},
            {
            customer_name: data.customer_name,
            customer_code: data.customer_code,
            customer_status: data.customer_status,
            customer_spoc: data.customer_spoc,
            customer_spoc_contact: data.customer_spoc_contact,
            customer_interaction_type: data.customer_interaction_type,
            contract: data.contract,
            contract_size: data.contract_size,
            country_region: data.country_region,
            actual_start_date: data.actual_start_date,
            expected_start_date: data.expected_start_date,
            notes: data.notes,
            organisation_id: data.organisation_id,
            customer_projects: data.customer_projects
        },
        {new:true}
    );
        if (!customer){
            return res.status(404).json(errorResponse("Customer Not Found"))
        }
        auditLogEntry(CustomerAuditLog,data, existingCustomer,req.params.id,req.user._id,"UPDATE")
        return res.json(successResponse(customer))
    } catch(error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const deleteCustomers = async(req,res) => {
    try{        
        const customer = await Customer.findByIdAndDelete(req.params.id)
        if (!customer){
            return res.status(404).json(errorResponse("Customer Not Found"))
        }
        
        auditLogEntry(CustomerAuditLog,"", "",req.params.id,req.user._id,"DELETE")
        return res.json(successResponse(customer))
    } catch(error){
        return res.status(500).json(errorResponse("Internal Server Error"))
    }
}

export const getCustomerAuditLogs = async(req, res) => {
    try{
        const logs = await CustomerAuditLog.find({customer_id: req.params.id})
        return res.json(successResponse(logs))
    } catch(error){
        return res.status(500).json(errorResponse("Internal Server Error"))
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
//         const auditLog  = new CustomerAuditLog({
//             action: action,
//             customer_id: id,
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