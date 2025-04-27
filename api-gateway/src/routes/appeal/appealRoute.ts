import { Router } from 'express';
import { AppealController } from '../../controllers/appeal/appealController.js';
import { 
  validateCreateAppeal, 
  validateUpdateAppeal 
} from '../../middlewares/appeal/appealMiddleware.js';

const router = Router();
const controller = new AppealController();

router.post('/', validateCreateAppeal, controller.createAppeal.bind(controller));
router.put('/:id/start', controller.startAppeal.bind(controller));
router.put('/:id/complete', validateUpdateAppeal('complete'), controller.completeAppeal.bind(controller));
router.put('/:id/cancel', validateUpdateAppeal('cancel'), controller.cancelAppeal.bind(controller));
router.get('/', controller.getAppeals.bind(controller));
router.delete('/cancel-all', controller.cancelAllInProgress.bind(controller));

export default router;