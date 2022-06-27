import { Request, Response } from "express";
import { CreateTransferService } from "../services";
import { ResponseWriter } from "../utils";

class TransferController {
  private ResponseWriter = ResponseWriter;

  private CreateTransfer = CreateTransferService;

  public async handle(request: Request, response: Response): Promise<void> {
    try {
      const data = await new this.CreateTransfer().execute(request.body);

      this.ResponseWriter.success(response, 200, data);
    } catch (error) {
      this.ResponseWriter.error(response, error as Error);
    }
  }
}

export { TransferController };
