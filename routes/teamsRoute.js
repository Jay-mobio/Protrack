import express from "express";
import { createTeam, deleteTeam, getTeam, getTeams, isAuthenticated, updateTeam } from "../controller/index.js";

const router = express.Router();

router.post("",isAuthenticated,createTeam)
router.get("",isAuthenticated,getTeams);
router.get("/:id",isAuthenticated,getTeam);
router.put("/:id",isAuthenticated,updateTeam);
router.delete("/:id",isAuthenticated,deleteTeam)

export {router as teamsRouter}