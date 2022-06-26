import { ReqQuery, Response } from 'express';
import { GetExtractService } from '../services';
import { ResponseWriter } from '../utils';

class BankStatementController {
  private ResponseWriter = ResponseWriter;

  private GetExtract = GetExtractService;

  public async handle(request: ReqQuery, response: Response): Promise<void> {
    try {
      console.log('request ', request.query);
      const data = await new this.GetExtract().execute(request.query);

      this.ResponseWriter.success(response, 200, data);
    } catch (error) {
      this.ResponseWriter.error(response, error as Error);
    }
  }
}

export { BankStatementController };
