import { Router } from 'express';
import { CreateAccountController } from '../controllers';

const route = Router();

route.route('/create-account')
  .post(new CreateAccountController().handle.bind(new CreateAccountController()));

export default route;
