import dotenv from "dotenv";
import axios from "axios";
import moment from "moment";
import {Space, Project, TeamMember, ProjectMatrixReport, ProjectAuditLog, ProjectMetricsAuditLog} from "../models/index.js";
import { auditLogEntry } from "../utils/methods.js";

dotenv.config();
const BASE_URL = process.env.CLICKUP_BASE_URL
const TOKEN = process.env.CLICKUP_AUTH_TOKEN
const CLICKUP_TEAM_ID = process.env.CLICKUP_TEAM_ID

export const addClickupProject = async (req, res) => {
    try {
        // Await the retrieval of spaces from the database
      const spaces = await Space.find();
      
  
      // Iterate over spaces and fetch projects for each space
      const spacesWithProjects = await Promise.all(
        spaces.map(async (space) => {
          try {
            
            // Make the API request to ClickUp to get projects for the current space
            const projectUrl = await axios.get(`${BASE_URL}/api/v2/space/${space.sapce_id}/folder?archived=false`, {
              headers: {
                Authorization: TOKEN,
              },
            });
            
            const projects = projectUrl.data.folders || [];

            const savedProjects = await Promise.all(
              projects.map(async (project) =>{
                try{
                  const existingProject = await Project.findOne({ project_id: project.id });
                  if (!existingProject){
                    const newProject = new Project({
                      project_id: project.id,
                      project_name: project.name,
                      space_id: space.sapce_id,
                      organisation: 1
  
                    });
                    return await newProject.save();
                  } else{
                    console.log(`Project ${project.name} already exists in the database`);
                    return existingProject;
                  }
                } catch (error) {
                  console.error(`Failed to save project ${project.name} for space_id: ${space.space_id}`, error.message);
                }
              })
            )
            // Return the space details along with the fetched projects
            return {
              space_id: space.space_id,
              space_name: space.space_name,
              projects: savedProjects,
            };
  
          } catch (error) {
            console.error(`Failed to fetch projects for space_id: ${space.space_id}`, error.message);
  
            // Return the space details with an empty project array and an error message if the API call fails
            return {
              space_id: space.space_id,
              space_name: space.space_name,
              projects: [],
              error: 'Failed to fetch projects',
            };
          }
        })
      );
  
      // Return the spaces with the fetched projects
      res.status(200).json({
        message: "Spaces and their projects retrieved successfully",
        spaces: spacesWithProjects,
      });
  
    } catch (error) {
      // Handle errors for the main process
      res.status(500).json({ error: error.message });
    }
  };

export const getProjects = async (req, res) => {
  try {    
    const projects = await Project.find(); // Fetch all projects from the database
    res.status(200).json({ message: "Projects retrieved successfully", projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async(req,res) =>{
  try {
    const existingProject = await Project.findOne({project_id:req.body.project_id});
    if (existingProject){
      return res.status(409).json({error: "Project already exists"});
    }
    const newProject = new Project(
      {project_name : req.body.project_name,
      expected_start_date : req.body.expected_start_date,
      expected_end_date : req.body.expected_end_date,
      actual_start_date : req.body.actual_start_date,
      actual_end_date : req.body.actual_end_date,
      project_code : req.body.project_code,
      manager_id : req.body.manager_id,
      owner_id : req.body.owner_id,
      organisation_id : req.body.organisation_id,
      project_type : req.body.project_type,
      cost_type : req.body.cost_type,
      currency : req.body.currency,
      amount : req.body.amount,
      status : req.body.status,
      health : req.body.health,
      estimated_efforts : req.body.estimated_efforts,
      actual_efforts : req.body.actual_efforts,
      contract_link : req.body.contract_link,
      engagement_type : req.body.engagement_type,
      consulted : req.body.consulted,
      account_manager_id : req.body.account_manager_id,
      project_spoc : req.body.project_spoc,
      spoc_contact : req.body.spoc_contact,
      customer_id : req.body.customer_id,
      space_id : req.body.space_id,
      interactions_types : req.body.interactions_types,
      accountable : req.body.accountable,
      informed : req.body.informed,
      project_folder : req.body.project_folder,
      resources : req.body.resources,
      created_by : req.body.created_by}
    )
    await newProject.save();
    res.status(409).json({ message: "Projects retrieved successfully", newProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateProject = async (req, res) => {
  try{
    const data = req.body
    const existingProject = await Project.findById(req.params.id);
    const project = await Project.findByIdAndUpdate(
      {_id:req.params.id},
      {project_name: data.project_name,
      expected_start_date: data.expected_start_date,
      expected_end_date: data.expected_end_date,
      actual_start_date: data.actual_start_date,
      actual_end_date: data.actual_end_date,
      project_code: data.project_code,
      manager_id: data.manager_id,
      owner_id: data.owner_id,
      organisation_id: data.organisation_id,
      project_type: data.project_type,
      cost_type: data.cost_type,
      currency: data.currency,
      amount: data.amount,
      status: data.status,
      health: data.health,
      estimated_efforts: data.estimated_efforts,
      actual_efforts: data.actual_efforts,
      contract_link: data.contract_link,
      engagement_type: data.engagement_type,
      consulted: data.consulted,
      account_manager_id: data.account_manager_id,
      project_spoc: data.project_spoc,
      spoc_contact: data.spoc_contact,
      customer_id: data.customer_id,
      space_id: data.space_id,
      interactions_types: data.interactions_types,
      accountable: data.accountable,
      informed: data.informed,
      project_folder: data.project_folder,
      resources: data.resources},
      {new: true}
    );
    if (!project){
      return res.status(404).json({ message: "Project not found"});
    }
    auditLogEntry(ProjectAuditLog,data,existingProject,req.params.id,req.user._id, "UPDATE")
    return res.json({"project_user": project});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getClickupProjectLogs = async (req, res) =>{
  try {
    const project = await Project.findById(req.params.id)
    if (!project){
      res.status(404).json({ message: "Project not found"});
    }
    const members = await TeamMember.find({
      project_id: req.params.id,
    }).populate('resource_id');;
        
    const ids = members.map(member => member.resource_id.clickup_id);
    
    const commaSaperatedString =  ids.join(", ")
    
    
    const param = {
      folder_id: project.project_id,
      is_billable:"",
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      assignee: commaSaperatedString,
      estimate: "true",
    }    
    
    const timeUrl = await axios.get(`${BASE_URL}/api/v2/team/${CLICKUP_TEAM_ID}/time_entries`,{
      headers: {Authorization: TOKEN},
      params: param
    })
    let logList = []
    const timeEntries = timeUrl.data
    for (const member of members) {
      let duration = calculateUserDuration(member,timeEntries,req.body.list_id)      
      let userDict = {
        name: member.resource_id.first_name + ' ' + member.resource_id.last_name,
        duration: convertMillisecondsToFloatHRS(duration),
        assignee_id: member.resource_id.clickup_id,
        project_id: req.params.id,
        duration_range: req.body.list_id ? req.body.list_name: getDateRangeString(req.query.start_date, req.query.end_date)
      }      
      let metrics = await ProjectMatrixReport.findOne({assignee_id: member.resource_id.clickup_id,duration_range: userDict.duratioon_range})      
      if (metrics){
        metrics.duration = userDict.duration
        await metrics.save();
      } else{       
        metrics = new ProjectMatrixReport(userDict)
        await metrics.save();
      }

      logList.push(metrics);
    }
    
    return res.json({data: logList});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getClickupLogs = async (req, res) => {
  try{  
    
    const projects = await Project.findById(req.params.id);
    if (!projects){
      return res.status(404).json({ error:"Project not found"});
    }    
    if (req.query.listName){
      const logs = await ProjectMatrixReport.findById({duration_range: req.query.listName, project_id: req.param.id})
      return res.json({data: logs})
    } else{
      const duration_range = getDateRangeString(req.query.startDate, req.query.endDate)
      
      const logs = await ProjectMatrixReport.find({duration_range: duration_range,project_id: req.params.id})
      return res.json({data: logs})
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClickupLogs = async (req, res) => {
  try {
    const data = req.body;
    const existingLog = await ProjectMatrixReport.findById(req.params.id);
    const log = await ProjectMatrixReport.findByIdAndUpdate(
      {_id:req.params.id},
      {
        assignee_id: data.assignee_id,
        name: data.name,
        estimate: data.estimate,
        capacity: data.capacity,
        duration: data.duration,
        duration_range: data.duration_range,
        dev_defects: data.dev_defects,
        delivery_defects: data.delivery_defects,
        review_defects: data.review_defects,
        total_defects: data.total_defects,
        capacity_utilization: data.capacity_utilization,
        effort_variances: data.effort_variances,
        defect_leakage: data.defect_leakage,
        defect_density: data.defect_density,
        review_effictiveness: data.review_effictiveness,
        root_cause: data.root_cause,
        corrective_action: data.corrective_action,
        preventive_action: data.preventive_action
      },
      {new:true}
    );
    if (!log){
      return res.status(404).json({message:"Log not found"});
    }
    console.log(data);
    console.log(existingLog);
    
    auditLogEntry(ProjectMetricsAuditLog,data,existingLog,req.params.id,req.user._id, "UPDATE")
    return res.json({message: "Log updated successfully", data: log})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClickupLog = async (req, res) => {
  try{
    const log = await ProjectMatrixReport.findOneAndDelete(req.params.id);
    if(!log){
      res.status(404).json({ error:"Log not found"});
    }
    auditLogEntry(ProjectMetricsAuditLog,"","",req.params.id,req.user._id, "DELETE")
    res.json({ message: "Log deleted successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getProjectAudittLogs = async(req, res) => {
  try{
      logs = await ProjectAuditLog.find()
      return res.json({data: logs})
  } catch(error){
      res.status(500).json({error: error.message})
  }
}

export const getProjectMetricsAuditLogs = async(req, res) => {
  try{
      logs = await ProjectMetricsAuditLog.find()
      return res.json({data: logs})
  } catch(error){
      res.status(500).json({error: error.message})
  }
}

export function calculateUserDuration (user,time_entries,list_id){
  let durationTime = 0 
  time_entries.data.forEach(duration =>{
    const username = `${user.resource_id.first_name} ${user.resource_id.last_name}`;
    if(duration.user.username === username){
      if(!list_id || list_id && duration.task_location.list_id === list_id){
        durationTime += parseInt(duration.duration,10)
      }
    }
  });
  return durationTime;
}

export function convertMillisecondsToFloatHRS(milliseconds){
    const totalSeconds = parseInt(milliseconds, 10) / 1000;
    const hours = totalSeconds / 3600;
    const formattedHrs = Math.round(hours * 100) / 100;
    return formattedHrs;
}

export function getDateRangeString (start, end){
  const startDate = getDate(start)
  const endDate = getDate(end)

  const startDatestr = moment(startDate).format('MM/DD/YYYY');
  const endDatestr = moment(endDate).format('MM/DD/YYYY');
  return `${startDatestr} - ${endDatestr}`
}

export function getDate(milliseconds){
  return new Date(parseInt(milliseconds))
}

// async function aduitLogEntry(data, beforeData, id, userID, action) {
//   try {        
//       if (action === "DELETE") {
//           await auditLogDataInsert(id, "DELETE", "", "", "", userID);
          
//       } else {
//           for (let field in data) {
//               let isChanged;
//               const beforeValue = beforeData[field];
//               const afterValue = data[field];
//               if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
//                 // Use JSON.stringify to compare objects/arrays
//                 isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);
//             } else {              
//                 // Use !== for primitive types
//                 isChanged = beforeValue !== afterValue;
//             }
//            isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);


//               // Only log if values are different
//               if (isChanged) {
//                 console.log(beforeValue, afterValue);
                
//                 await auditLogDataInsert(id, "UPDATE", field, beforeValue, afterValue, userID);
//               }
//           }
//       }
//   } catch (error) {
//       console.error(`Error in addAuditLogDataInsert: ${error}`);
//   }
// }

// async function auditLogDataInsert(id, action, field, beforeValue, afterValue, userID){
//   try{      
//       const auditLog  = new ProjectAuditLog({
//           action: action,
//           project_id: id,
//           user_id: userID,
//           field_changed: field,
//           from_value: beforeValue,
//           to_value: afterValue,
//           updated_by: userID,
//           date_updated: moment().toDate()
//       });
//       await auditLog.save();
//   } catch(error){
//       console.error(`Error in addAuditLogDataInsert: ${error}`);
//   }
// }

// async function aduitLogEntrymetric(data, beforeData, id, userID, action) {
//   try {        
//       if (action === "DELETE") {
//           await auditLogDataInsertmetric(id, "DELETE", "", "", "", userID);
          
//       } else {
//           for (let field in data) {
//               let isChanged;
//               const beforeValue = beforeData[field];
//               const afterValue = data[field];
              
//               if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
//                 // Use JSON.stringify to compare objects/arrays
//                 isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);
//             } else {              
//                 // Use !== for primitive types
//                 isChanged = beforeValue !== afterValue;
//             }
//            isChanged = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);


//               // Only log if values are different
//               if (isChanged) {                
//                 await auditLogDataInsertmetric(id, "UPDATE", field, beforeValue, afterValue, userID);
//               }
//           }
//       }
//   } catch (error) {
//       console.error(`Error in addAuditLogDataInsert: ${error}`);
//   }
// }

// async function auditLogDataInsertmetric(id, action, field, beforeValue, afterValue, userID){
//   try{      
//       const auditLog  = new ProjectMetricsAuditLog({
//           action: action,
//           log_id: id,
//           user_id: userID,
//           field_changed: field,
//           from_value: beforeValue,
//           to_value: afterValue,
//           updated_by: userID,
//           date_updated: moment().toDate()
//       });
//       await auditLog.save();
//   } catch(error){
//       console.error(`Error in addAuditLogDataInsert: ${error}`);
//   }
// }