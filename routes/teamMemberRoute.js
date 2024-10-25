import expresss from 'express'
import { createTeamMember, isAuthenticated } from '../controller/index.js';


const router = expresss.Router();

router.post("",isAuthenticated,createTeamMember)


export {router as teamMemberRouter};