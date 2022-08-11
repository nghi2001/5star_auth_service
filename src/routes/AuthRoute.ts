import Express from 'express';
import { validate } from 'express-validation';
import UserController from '../controllers/UserController';
import UserValidation from '../helper/UserValidator';
import CheckCodeValidation from '../helper/CheckCodeValidation';
import LoginValidation from '../helper/LoginValidation';
import ChangePassValidation from '../helper/ChangePassValidation'
const router = Express.Router();

router.post("/sigup",validate(UserValidation,{},{}), UserController.sigup.bind(UserController));
router.post("/sigin",validate(LoginValidation), UserController.sigin.bind(UserController));

router.post("/changepass", validate(ChangePassValidation), UserController.changePassword.bind(UserController))
router.post("/active", validate(CheckCodeValidation), UserController.activeAccount.bind(UserController))
export default router