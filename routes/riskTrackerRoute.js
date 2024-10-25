import express from "express";
import { createRisk,  deleteRisk,  getRisk,   getRisks,   isAuthenticated, updateRisk } from "../controller/index.js";

const router = express.Router();

router.use(isAuthenticated)

router.post("",createRisk)
router.get("",getRisks);
router.get("/:id",getRisk);
router.put("/:id",updateRisk);
router.delete("/:id",deleteRisk)

export {router as RiskRouter}