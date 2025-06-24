import express, {Router} from 'express';

import { fetchToilets } from '../controllers/toiletsController.js';
const router = express.Router();

router.get('/', fetchToilets);

export default router;