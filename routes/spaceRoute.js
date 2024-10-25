import express from 'express'
import { createSpace, getSpace } from '../controller/index.js';


const router = express.Router();

router.post("", createSpace);
router.get("", getSpace);

export {router as spaceRouter};