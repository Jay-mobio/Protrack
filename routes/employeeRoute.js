import expresss from 'express'
import { createEmployee, deleteemaployee, getClickupEmployees, getDepartmentMetadata, getEmployee, getEmployees, getOrganisationMetadata, getReportingManagerMetadata, getResourceTypeMetadata, getSkillsMetadata, getStatusMetadata, updateEmployee } from '../controller/employeeController.js';
import { isAuthenticated } from '../controller/authController.js';

const router = expresss.Router();

router.get("/clickup",getClickupEmployees);
router.use(isAuthenticated)
router.post("",createEmployee)
router.get('/get-resource-type-metadata',isAuthenticated,getResourceTypeMetadata);
router.get("/get-status-metadata",isAuthenticated,getStatusMetadata)
router.get("/get-department-metadata",isAuthenticated,getDepartmentMetadata)
router.get("/get-skills-metadata",isAuthenticated,getSkillsMetadata)
router.get("/get-organisation-metadata",isAuthenticated,getOrganisationMetadata)
router.get("/get-reporting-manager-metadata/:id",isAuthenticated,getReportingManagerMetadata)
router.get("/get-users/:organisation_id",getEmployees)
router.get("/:id",getEmployee)
router.put("/:id",updateEmployee)
router.delete("/:id",deleteemaployee)

export {router as employeeRouter};