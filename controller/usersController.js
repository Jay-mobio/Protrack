import { ResourceType, User, UserAuditLog } from "../models/index.js";
import moment from "moment";
import { auditLogEntry, errorResponse, successResponse } from "../utils/methods.js";

export const createuser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
            status: req.body.status
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt)

        await user.save();
        return res.json({ msg: "User added successfully", user: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateUser = async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body
        const existingUser = await User.findById(id)
        const updated_user = await User.findByIdAndUpdate({_id:id},{first_name: data.first_name, last_name: data.last_name},{new: true});
        if (!updated_user){
            return res.status(404).json({error: "User not found"});
        }
        auditLogEntry(UserAuditLog,data,existingUser,id,req.user._id, "UPDATE")
        return res.json({"updated_user": updated_user});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

export const getUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUsers = async(req, res) => {
    try {
        const users = await User.find();
        return res.json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteuser = async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user){
            return res.status(404).json({error: "User not found"})
        }
        auditLogEntry(UserAuditLog,"","",req.params.id,req.user._id, "DELETE")
        return res.json({data:user})
    } catch(error){
        res.status(500).json({error: error.message})
    }
};

export const getUserAuditLogs = async(req, res) => {
    try{
        logs = await UserAuditLog.find()
        return res.json({data: logs})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

async function aduitLogEntry(data, beforeData, id, userID, action) {
    try {        
        if (action === "DELETE") {
            await auditLogDataInsert(id, "DELETE", "", "", "", userID);
            
        } else {
            for (let field in data) {
                let isChanged;
                const beforeValue = beforeData[field];
                const afterValue = data[field];

                isChanged = beforeValue !== afterValue;

                // Only log if values are different
                if (isChanged) {
                    await auditLogDataInsert(id, "UPDATE", field, beforeValue, afterValue, userID);
                }
            }
        }
    } catch (error) {
        console.error(`Error in addAuditLogDataInsert: ${error}`);
    }
}

async function auditLogDataInsert(id, action, field, beforeValue, afterValue, userID){
    try{
        
        const auditLog  = new UserAuditLog({
            action: action,
            user: id,
            user_id: userID,
            field_changed: field,
            from_value: beforeValue,
            to_value: afterValue,
            updated_by: userID,
            date_updated: moment().toDate()
        });
        await auditLog.save();
    } catch(error){
        console.error(`Error in addAuditLogDataInsert: ${error}`);
    }
}
