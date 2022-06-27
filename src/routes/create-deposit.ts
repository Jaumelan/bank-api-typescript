import { Router } from 'express';
import { DepositController } from '../controllers';

const route = Router();

route.route('/deposit')
.post(new DepositController().handle.bind(new DepositController()));

export default route;