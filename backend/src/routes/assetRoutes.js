import express from 'express';
import { getSupportedAssets, getAssetHistory } from '../controllers/assetController.js';

const router = express.Router();

router.get('/', getSupportedAssets);
router.get('/:symbol/history', getAssetHistory);

export default router;