import express from "express";
import { createCutsomer, deleteCustomers, getCustomer, getCustomerAuditLogs, getCustomers, isAuthenticated, updateCustomers } from "../controller/index.js";

const router = express.Router();

router.post("",isAuthenticated,createCutsomer)
router.get("",isAuthenticated,getCustomers);
router.get("/:id",isAuthenticated,getCustomer);
router.put("/:id",isAuthenticated,updateCustomers);
router.delete("/:id",isAuthenticated,deleteCustomers)
router.get("/logs/:id",isAuthenticated,getCustomerAuditLogs)

export {router as cutsomerRouter}