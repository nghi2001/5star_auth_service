import Express from 'express';
import UserController from '../controllers/UserController';
const router = Express.Router();

router.post("/sigup", UserController.sigup);
router.post("/sigin", UserController.sigin);
export default router