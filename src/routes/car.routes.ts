import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import { uploadCarImages } from '../libs/utils/uploader';
import { requireSeller } from '../libs/utils/auth';

const router = Router();
router.get('/', CarController.list);
router.get('/:id', CarController.getById);
router.post('/', requireSeller, uploadCarImages, CarController.create);
export default router;
