import express from "express";
import { createCategory, deleteCategory, getCategories, getCategory, getCategroyAuditLogs, isAuthenticated, updateCategory} from "../controller/index.js";

const router = express.Router();

router.post("",isAuthenticated,createCategory);
router.get("",isAuthenticated,getCategories);
router.get("/:id",isAuthenticated,getCategory);
router.put("/:id",isAuthenticated,updateCategory);
router.delete("/:id",isAuthenticated,deleteCategory)
router.get("/logs/:id",isAuthenticated,getCategroyAuditLogs);

export {router as categtoriesRouter}