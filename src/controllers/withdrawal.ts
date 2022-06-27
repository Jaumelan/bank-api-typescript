import { Request, Response } from 'express';
import { CreateWithdrawalService } from '../services';
import { ResponseWriter } from '../utils';

class WithdrawalController {
    private ResponseWriter = ResponseWriter;

    private CreateWithdrawal = CreateWithdrawalService;

    public async handle(request: Request, response: Response): Promise<void> {
        try {
            const data = await new this.CreateWithdrawal().execute(request.body);

            this.ResponseWriter.success(response, 200, data);
        } catch (error) {
            this.ResponseWriter.error(response, error as Error);
        }
    }
}

export { WithdrawalController };