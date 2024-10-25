import express from "express";
import { createTechnology, deleteTechnologies,getTechnologies, getTechnology, isAuthenticated, updateTechnology } from "../controller/index.js";

const router = express.Router();

router.post("",isAuthenticated,createTechnology)
router.get("",isAuthenticated,getTechnologies);
router.get("/:id",isAuthenticated,getTechnology);
router.put("/:id",isAuthenticated,updateTechnology);
router.delete("/:id",isAuthenticated,deleteTechnologies)

export {router as technologiesRouter}