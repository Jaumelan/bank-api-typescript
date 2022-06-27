import { Router } from "express";
import { TransferController } from "../controllers";

const route = Router();

route.route('/transfer')
.post(new TransferController().handle.bind(new TransferController()));

export default route;