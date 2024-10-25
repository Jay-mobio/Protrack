import express from "express";
import { createOpportunity,  deleteOpportunity,  getOpportunities, getOpportunity,   isAuthenticated, updateOpportunity } from "../controller/index.js";

const router = express.Router();

router.use(isAuthenticated)

router.post("",createOpportunity)
router.get("",getOpportunities);
router.get("/:id",getOpportunity);
router.put("/:id",updateOpportunity);
router.delete("/:id",deleteOpportunity)

export {router as OpportunityRouter}