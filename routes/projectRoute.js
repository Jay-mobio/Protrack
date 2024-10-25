import expresss from 'express'
import { addClickupProject, createProject, deleteClickupLog, getClickupLogs, getClickupProjectLogs, getProjects, isAuthenticated, updateClickupLogs, updateProject } from '../controller/index.js';

const router  = expresss.Router();

router.use(isAuthenticated)

router.get("",addClickupProject);
router.post("",createProject);
router.get("/list",getProjects);
router.put("/:id",updateProject);
router.post("/clickup-logs/:id",getClickupProjectLogs)
router.get("/clickup-logs/:id",getClickupLogs)
router.put("/clickup-logs/:id",updateClickupLogs)
router.delete("/clickup-logs/:id",deleteClickupLog)

export {router as projectRouter};