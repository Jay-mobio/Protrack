import { Project, TeamMember, User } from "../models/index.js";

export const createTeamMember = async (req,res) =>{
    try {
        const existingProject = await Project.findById(req.body.projectID)
        if (!existingProject){
            res.status(404).json({error:"Project not found"})
        }
        const existingUser = await User.findById(req.body.resourceID)
        if (!existingUser){
            res.status(404).json({error:"User not found"})
        }
        const existingTeamMember = await TeamMember.findOne({resource_id:req.body.resourceID,project_id:req.body.projectID})
        if (existingTeamMember){
            res.status(409).json({error:"Team member already exists"})
        }
        const newTeamMember = new TeamMember({
            project_id : req.body.projectID,
            resource_id : req.body.resourceID,
            role : req.body.role,
            role_details : req.body.role_details,
            billing_type : req.body.billing_type,
            allocated_date : req.body.allocated_date,
            status : req.body.status,
            amount : req.body.amount,
            currency : req.body.currency
        })
        await newTeamMember.save();
        res.status(200).json({message:"TeamMember added successfully",teamMember:newTeamMember})
    } catch(error){        
        res.status(500).json({ error: error.message });
    }
}

export const getTeamMember = async (req,res) => {
    try {
        const existingTeamMember = await TeamMember.findById(req.params.id);
        if (!existingTeamMember){
            return res.status(404).json({error:"Team Member exists"})
        }
        return res.json({data: existingCategory})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const getTeamMembers = async (req,res) => {
    try {
        const teamMember = await TeamMember.find();
        return res.json({data: teamMember})
    } catch (error){
        return res.status(500).json({error: error.message})
    }
}

export const updateTeamMember = async(req,res) => {
    try{
        const data = req.body
        const existingTeamMember = await TeamMember.findOne({
            project_id : data.project_id,
            resource_id : data.resource_id,
            _id: {$ne: req.params.id}
        }); 
        if(existingTeamMember) {
            return res.status(409).json({error: "Resource already exists"})
        }
        const teamMember = await TeamMember.findByIdAndUpdate(
            {_id: req.params.id},
            {
                project_id: data.project_id,
                resource_id: data.resource_id,
                role: data.role,
                role_details: data.role_details,
                billing_type: data.billing_type,
                allocated_date: data.allocated_date,
                status: data.status,
                amount: data.amount,
                currency: data.currency
        },
        {new:true}
    );
        if (!teamMember){
            return res.status(404).json({error: "Team Member not found"})
        }
        return res.json({data:teamMember})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

export const deleteTeamMember = async(req,res) => {
    try{
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id)
        if (!teamMember){
            return res.status(404).json({error: "Team Member not found"})
        }
        return res.json({data:teamMember})
    } catch(error){
        res.status(500).json({error: error.message})
    }
}