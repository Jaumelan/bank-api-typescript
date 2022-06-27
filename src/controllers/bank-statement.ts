import { Request, Response } from 'express';
import { RequestBankStatement } from '../models';
import { GetExtractService } from '../services';
import { ResponseWriter } from '../utils';

class BankStatementController {
  private ResponseWriter = ResponseWriter;

  private GetExtract = GetExtractService;

  // eslint-disable-next-line no-undef
  public async handle(
    request: Request<{}, {}, {}, RequestBankStatement>,
    response: Response,
  ): Promise<void> {
    try {
      // console.log('request received ', request.query);
      const data = await new this.GetExtract().execute(request.query);

      this.ResponseWriter.success(response, 200, data);
    } catch (error) {
      this.ResponseWriter.error(response, error as Error);
    }
  }
}

export { BankStatementController };
