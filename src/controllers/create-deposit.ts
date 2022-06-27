import { Request, Response } from 'express';
import { CreateDepositService } from '../services';
import { ResponseWriter } from '../utils';

class DepositController {
    private ResponseWriter = ResponseWriter;

    private CreateDeposit = CreateDepositService;

    public async handle(request: Request, response: Response): Promise<void> {
        try {
            const data = await new this.CreateDeposit().execute(request.body);

            this.ResponseWriter.success(response, 200, data);
        } catch (error) {
            this.ResponseWriter.error(response, error as Error);
        }
    }
}

export { DepositController };