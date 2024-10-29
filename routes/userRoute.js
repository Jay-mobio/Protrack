import express from "express";
import { createuser, deleteuser,getUser, getUsers, isAuthenticated, updateUser } from "../controller/index.js";

const router = express.Router();

router.post('/',isAuthenticated,createuser);
router.get('/:id',isAuthenticated,getUser);
router.get('/',isAuthenticated,getUsers);
router.put('/:id',isAuthenticated,updateUser);
router.delete('/:id',isAuthenticated,deleteuser);

export {router as userRouter};