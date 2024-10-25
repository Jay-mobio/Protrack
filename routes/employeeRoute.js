import expresss from 'express'
import { createEmployee, deleteemaployee, getClickupEmployees, getEmployee, getEmployees, updateEmployee } from '../controller/employeeController.js';
import { isAuthenticated } from '../controller/authController.js';

const router = expresss.Router();

router.get("/clickup",getClickupEmployees);
router.use(isAuthenticated)

router.post("",createEmployee)
router.get("",getEmployees)
router.get("/:id",getEmployee)
router.put("/:id",updateEmployee)
router.delete("/:id",deleteemaployee)

export {router as employeeRouter};