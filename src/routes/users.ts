import { CreateUserController } from "../controllers";
import { Router } from "express";

const router = Router();

router.route('/users').post(new CreateUserController().handle.bind(new CreateUserController()));

export default router;