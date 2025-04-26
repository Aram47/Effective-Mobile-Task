import { Router } from "express";
import AppealMiddleware from "../middlewares/AppealMiddleware.js";
import AppealService from "../services/appealService.js";
import AppealController from "../controllers/appealController.js";

const appealController = new AppealController(new AppealService());
const router: Router = Router();

router.post('/', appealController.createAppeal.bind(appealController));
router.patch('/:id/assign', appealController.assignAppeal.bind(appealController));
router.patch('/:id/complete', appealController.completeAppeal.bind(appealController));
router.patch('/:id/cancel', appealController.cancelAppeal.bind(appealController));
router.get('/', appealController.getAppeals.bind(appealController));
router.delete('/cancel-all-in-progress', appealController.cancelAllInProgress.bind(appealController));

export default router;