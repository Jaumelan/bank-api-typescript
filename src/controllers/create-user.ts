import { Request, Response } from 'express';
import { CreateUserService } from '../services';
import { ResponseWriter } from '../utils';

class CreateUserController {
  private CreateUserService = CreateUserService;

  private responseWriter = ResponseWriter;

  public async handle(request: Request, response: Response): Promise<void> {
    try {
      // console.log(request.body);
      const data = await new this.CreateUserService().execute(request.body);

      this.responseWriter.success(response, 201, data);
    } catch (error) {
      this.responseWriter.error(response, error as Error);
    }
  }
}

export { CreateUserController };
