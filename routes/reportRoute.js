import expresss from 'express'
import { getMonthlyReports } from '../controller/index.js';

const router  = expresss.Router();

router.get('/:type/:team',getMonthlyReports)

export {router as reportRoutes};