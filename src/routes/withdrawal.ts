import { Router } from 'express';
import { WithdrawalController } from '../controllers';

const route = Router();

route.route('/withdrawal')
.post(new WithdrawalController().handle.bind(new WithdrawalController()));

export default route;