import express from 'express';
import { 
  createAlertRule, 
  getUserAlertRules, 
  deleteAlertRule 
} from '../controllers/alertRuleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createAlertRule)
  .get(getUserAlertRules);

router.route('/:id')
  .delete(deleteAlertRule);

export default router;