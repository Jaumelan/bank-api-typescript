import { Router } from 'express';
import { BankStatementController } from '../controllers';

const route = Router();

route.route('/extract')
  .get(new BankStatementController().handle.bind(new BankStatementController()));

export default route;
